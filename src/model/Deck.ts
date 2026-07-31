import FlashCard from "./FlashCard.ts";
import {assert} from "../assertions.ts";
import {CardNotFoundException, DuplicateException, InvalidNameException} from "./exceptions.ts";
import type Listener from "./Listener.ts";
import {supabase} from "../supabaseClient.ts";

//Instances of this class serve as decks of cards that user can go through.
//TODO future feature to copy cards, transfer from one deck to another
export default class Deck {
    #id? : number;          //assigned by the database
    #ownerID: number;           //TODO not sure if this is best practice
    #name: string;          //name of the deck (ex: Bio)
    #cards: Array<FlashCard>;    //the cards in the deck
    #listeners: Array<Listener>;
    private constructor(name:string, ownerID: number) {
        //Initialise the name of the deck
        this.#name = name;
        this.#ownerID = ownerID;
        //check preconditions
        if (this.#name.length === 0) {
            throw new InvalidNameException;
        }
        this.#cards = new Array<FlashCard>();
        this.#listeners = new Array<Listener>();
        //Check invariants
        this.#checkDeck();
    }

    static async build(name:string, ownerId: number): Promise<Deck>{
        const deck = new Deck(name, ownerId);

        await Deck.saveDeck(deck, deck.#ownerID);

        return deck;

    }

    #checkDeck(): void {
    //Invariants
        assert(this.#name.length > 0, "Names must not be empty")
    }

    //register all the things that will be listening to the notebook
            //currently just the deck-menu-view, but could also be the notebook view
            //considering that it will display how many flashcards each deck has for example

    registerListener(listener: Listener): void {
        this.#listeners.push(listener);
        //check invariants
        this.#checkDeck();
    }

    //TODO this whole approach might be inefficient since Deck will probably only ever have one listener
    //A specific listener instance is removed from the model's list of listeners so it is no longer notifying it
    //Going out of deckmenu means we delete it - but deck menu registers itself as a listener to the model
    unregisterListener(listener: Listener): void {
        //https://stackoverflow.com/questions/15292278/how-do-i-remove-an-array-item-in-typescript
        this.#listeners = this.#listeners.filter((l) => l !== listener);
        //check invariants
        this.#checkDeck();
    }

    //Notify all the listeners that a change happened to the domain model (new number of cards)
    #notifyAll() {
        this.#listeners.forEach((l) => l.notify());
        //TODO it would be a good idea to save the info to database on each notify
    }


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

    //Current methods that I want to implement

    //Add a card to the deck (cards must have unique names)
    //not sure about paramters yet, maybe name or number(id) of the deck
    //return boolean - whether operation was successful
    addCard(card : FlashCard): void{
        //Check if the card duplicate already exists only push if it doesnt exist
        if(this.#isCardDuplicate(card)){
            throw new DuplicateException();
        }else{
            this.#cards.push(card);
            //TODO persist data
            //Notify all listeners
            //TODO want to seperate the deck listener and the notebook listener
            this.#notifyAll();
        }
    }
    //get a flashcard instance by the title
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

    //Private function to check whether a created card has a duplicate name to one that is already in the list
    #isCardDuplicate(card: FlashCard): boolean {
        let found: boolean = false;
        for(let i = 0; i < this.#cards.length; i++){
            if(this.cards.at(i)?.titleSide === card.titleSide){
                found = true;
            }
        }
        return found;
    }

    //Find a card in the deck based on title and deletes it
    //TODO optimise this method
    removeCard(title: string): void  {
        if(title.length === 0){
            throw new InvalidNameException();
        }

        //using while loop to not go through the whole array for no reason
        let i = 0;              //index of the card we will delete in the deck

        while(i < this.#cards.length && this.cards.at(i)?.titleSide !== title){
            i++;
        }

        if(i === this.cards.length){
            throw new CardNotFoundException;
        }

        //remove the single card at index i
        //https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
        //remove the single card at index i
        this.#cards.splice(i, 1);

        //TODO persist data
        //Notify all listeners that the deck changed
        this.#notifyAll();

        //check invariants
        this.#checkDeck();
    }

    /*
    * DB stuff
    *  */

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

}