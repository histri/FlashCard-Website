import FlashCard from "./FlashCard.ts";
import {assert} from "../assertions.ts";
import {CardNotFoundException, DuplicateException, InvalidNameException} from "./exceptions.ts";
import type Listener from "./Listener.ts";
import {supabase} from "../supabaseClient.ts";

//Instances of this class serve as decks of cards that user can go through.
//TODO future feature to copy cards, transfer from one deck to another

export default class Deck {
    #id? : number;                //id of the class instance given by database
    #ownerID: number;             //id of the data owner of this instance
    #name: string;                //name of the deck (ex: Bio)
    #cards: Array<FlashCard>;    //the cards in the deck
    #listeners: Array<Listener>;    //object that listen to changes in the deck

    //Constructor with optional parameters
    private constructor(name:string, ownerID: number, id?: number, cards?: Array<FlashCard>) {
        this.#name = name;
        this.#ownerID = ownerID;

        //if object was just created (no database id is assosiated with it)
        if(id === undefined){
            this.#cards = new Array<FlashCard>();
            //todo, not sure if the deck exists but is empty
        }else{
            //else this object already exists in the database we fetch the data from there to create the class instace
            this.#id= id;
            this.#cards = cards!;
        }


        //check preconditions
        if (this.#name.length === 0) {
            throw new InvalidNameException;
        }

        //Listeners are always assigned at run time
        this.#listeners = new Array<Listener>();
        //Check invariants
        this.#checkDeck();
    }

    //build() - Async method - creates instance of the class and saves it to the database
    //      name - name of the deck
    //      ownerID - DB id of the data owner
    static async build(name:string, ownerId: number): Promise<Deck>{
        const deck = new Deck(name, ownerId);

        await Deck.saveDeck(deck, deck.#ownerID);

        return deck;

    }

    //checkDeck() - checks the class invariants
    #checkDeck(): void {
    //Invariants
        assert(this.#name.length > 0, "Names must not be empty")
    }

    //register all the things that will be listening to the notebook
    //      listener - some class instance that listens to this class instance
    registerListener(listener: Listener): void {
        this.#listeners.push(listener);
        //check invariants
        this.#checkDeck();
    }

    //unregisterListener() - A specific listener instance is removed from the model's list of listeners
    //          thus current class instance is no longer notifying a given listener
    unregisterListener(listener: Listener): void {
        //https://stackoverflow.com/questions/15292278/how-do-i-remove-an-array-item-in-typescript
        this.#listeners = this.#listeners.filter((l) => l !== listener);
        //check invariants
        this.#checkDeck();
    }

    //Notify all the listeners that a change happened to the domain model (new number of cards)
    #notifyAll() {
        this.#listeners.forEach((l) => l.notify());
    }

    /*Getters*/

    get name(): string {
        return this.#name;
    }
    get cards (): Array<FlashCard> {
        return this.#cards;
    }
    get size() : number {
        return this.#cards.length;
    }

    get id(): number | undefined {
        return this.#id;
    }

    /*Deck Manipulation */

    //Add a card to the deck (cards must have unique names)
    //  card - given acrd that is added to the array
    //  return boolean - whether operation was successful
    async addCard(title: string, info: string): Promise<void>{
        //Check if the card duplicate already exists only push if it doesnt exist
        if(this.#isCardDuplicate(title)){
            throw new DuplicateException();
        }
        const card = await FlashCard.build(title, info, this.#id!);
        this.#cards.push(card);
        this.#notifyAll();
    }


    //getCard() - get a flashcard instance by the title
    //     title - the title of the card we are looking for
    getCard(title: string): FlashCard {
        let card: FlashCard| undefined = undefined;
        for(let i = 0; i < this.#cards.length; i++){
            if(this.cards.at(i)?.titleSide === title){
                card = this.#cards[i];
            }
        }
        if (card === undefined) {
            throw new CardNotFoundException();
        }
        return card;
    }

    //editCard() - take an existing card and change its title/info
    //  oldTitle - previous title the that card held
    //  newTitle - new title that will be given to the card
    //  newInfo - new info that will be given to the card
    editCard(oldTitle: string, newTitle: string, newInfo: string): void {
        //find the card we want to edit (throws CardNotFoundException if missing)
        let card = this.getCard(oldTitle);

        //check if any OTHER card already has the new title
        let isDuplicate: boolean = false;
        for (let i = 0; i < this.#cards.length; i++) {
            let otherCard = this.#cards.at(i);
            //skip comparing the card against itself
            if (otherCard !== card && otherCard?.titleSide === newTitle) {
                isDuplicate = true;
            }
        }
        if (isDuplicate) {
            throw new DuplicateException();
        }

        //update the card - throws InvalidNameException / InvalidInfoException if invalid
        card.editItself(newTitle, newInfo);

        //TODO persist data
        this.#notifyAll();

        //check invariants
        this.#checkDeck();
    }

    //isCardDuplicate() Private helper to check whether a created card has a duplicate name to one that is already in the list
    #isCardDuplicate(newTitle:string): boolean {
        let found: boolean = false;
        for(let i = 0; i < this.#cards.length; i++){
            if(this.cards.at(i)?.titleSide === newTitle){
                found = true;
            }
        }
        return found;
    }

    //removeCard() - Find a card in the deck based on title and deletes it
    //TODO optimise this method
    async removeCard(title: string): Promise<void> {
        if(title.length === 0){
            throw new InvalidNameException();
        }

        //using while loop to not go through the whole array for no reason
        let i = 0;              //index of the card we will delete in the deck
        while(i < this.#cards.length && this.cards.at(i)?.titleSide !== title){
            i++;
        }
        //if i exceeded the indexes of cards 0 based it means the card was not found
        if(i === this.cards.length){
            throw new CardNotFoundException;
        }

        let toDelete: FlashCard = this.#cards[i];
        //remove the single card at index i
        //https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
        //remove the single card at index i
        this.#cards.splice(i, 1);

        //DB
        await FlashCard.deleteCard(toDelete);
        //Notify all listeners that the deck changed
        this.#notifyAll();

        //check invariants
        this.#checkDeck();
    }



    /*
    * DB stuff
    *  */

    //saveDeck() - saves a given Deck instance to the DB while cascading and saving its children
    //  deck - deck instance we are saving
    //  ownerId - id of the parent instance for the given deck
    static async saveDeck(deck: Deck, ownerId: number): Promise<void> {
        //save the deck to the Supabase tables

        //only save the deck initially if it doesnt exist in DB yet
        if(deck.#id === undefined){
            const response = await supabase
                .from('decks')      //table name
                .insert([
                    {
                        deck_name: deck.name, owner_user_id: ownerId
                    }
                ])
                .select();


            // Access properties directly off the response object
            if (response.error || response.data == null) {
                console.error('Error saving Deck:', response.error);
                return;
            }
            console.log('Deck saved successfully:', response.data);
            deck.#id = response.data[0].id;

        }

        //TODO what if notebook/deck/card got edited?

        // Cascade: save each deck that belongs to this notebook, the same way
        deck.cards.forEach((card:FlashCard) => {
            // FOR NOW only cards that haven't been saved yet
            // should get inserted here
            if(card.id === undefined){
                FlashCard.saveCard(card, deck.#id!);
            }
        });

    }

    //loadDecksForNotebook() - static method that loads all the decks thte user has based on their id
    //      owenerId - DB id of the user we are finding the decks of
    static async loadDecksForNoteBook(ownerId: number): Promise<Array<Deck>> {

        let decks: Array<Deck> = [];            //initialise an empty deck

        //select * where owner_user_id = ownerID
        const {data, error} = await supabase
            .from('decks')
            .select('*')
            .eq('owner_user_id', ownerId)


        //Construct decks that have the same owner id
        // @ts-ignore - for now I know the data will work
        for (const row of data) {
            const cards = await FlashCard.loadCardsForDeck(row.id);         //get an array of cards for the deck
            const deck = new Deck(row.deck_name, row.owner_user_id, row.id, cards);
            decks.push(deck);

        }

        return decks;
    }

}