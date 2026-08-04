import {InvalidInfoException, InvalidNameException} from "./exceptions.ts";
import {assert} from "../assertions.ts";
import {supabase} from "../supabaseClient.ts";

export default class FlashCard {
    //Main functionality for the application
    //Each flash card has a title and info side the user studies by
    //      trying to recollect info about a specific title
    //      (ex title - Labrador Retriever, info side - The Labrador Retriever, also known simply as the Labrador or Lab, is a British breed of retriever gun dog)
    //      https://en.wikipedia.org/wiki/Labrador_Retriever
    // The user can input the title and info, flip the card
    //TODO possible future functionality - draw input,


    #id?: number;                //for future when woking with DB persistence
    #ownerId: number;
    #titleSide: string;             //front side of the card
    #infoSide: string;      //back side of the card that gets revealed later


    private constructor(titleSide:string, infoSide:string, ownerId:number, id?: number) {
        this.#titleSide = titleSide;
        this.#infoSide = infoSide;
        this.#ownerId = ownerId;
        //in the case the object gets constructed from the DB
        if(id !== undefined) {
            this.#id = id;
        }

        //check preconditions
        if(this.#titleSide.length ===0){
            throw new InvalidNameException();
        }
        if(this.#infoSide.length ===0){
            throw new InvalidInfoException();
        }
        //check invariants
        this.#checkCard();
    }

    static async build(titleSide: string, infoSide:string, ownerId:number): Promise<FlashCard>{
        const card = new FlashCard(titleSide, infoSide, ownerId);

        await FlashCard.saveCard(card, ownerId);

        return card;
    }

    #checkCard() :void{
        //Invariants
        assert(this.#titleSide.length > 0, "Title must not be empty");

        //TODO maybe get rid of this assertion
        assert(this.#infoSide.length > 0, "Info must not be empty");
    }

    //GETTERS

    get titleSide(){
        return this.#titleSide;
    }
    get infoSide(){
        return this.#infoSide;
    }
    get id(): number|undefined{
        return this.#id;
    }

    editItself(newTitle: string, newInfo:string): void {
        // check preconditions BEFORE mutating anything
        if (newTitle.length === 0) {
            throw new InvalidNameException();
        }
        if (newInfo.length === 0) {
            throw new InvalidInfoException();
        }
        this.#titleSide = newTitle;
        this.#infoSide = newInfo;
        // check invariants
        this.#checkCard();
    }


    /*
* DB stuff
*  */

    //TODO
    static async saveCard(card : FlashCard, ownerDeckId: number): Promise<void> {
        //save the deck to the Supabase tables
        //for now only saving if id is undefined obviously will change since you can edit and delete cards
        if(card.id === undefined){
            const response = await supabase
                .from('flashcards')      //table name
                .insert([
                    {
                        title: card.titleSide,
                        info: card.infoSide,
                        deck_id: ownerDeckId            //TODO not sure if this or card.id is correct
                    }
                ])
                .select();

            //TODO need to get id of the parent object to make the foreign key constraint work


            // Access properties directly off the response object
            if (response.error|| response.data == undefined) {
                console.error('Error saving Deck:', response.error);
                return;
            }

            console.log('Deck saved successfully:', response.data);
            card.#id = response.data[0].id;

        }


        //TODO what if notebook/deck/card got edited?

    }

    static async loadCardsForDeck(ownerId:number): Promise<Array<FlashCard>>{
        let cards: Array<FlashCard> = [];

        const {data, error} = await supabase
            .from('flashcards')
            .select('*')
            .eq('deck_id', ownerId);

        //Construct the cards and return them
        // @ts-ignore
        for(const row of data){
            const single = new FlashCard(row.title, row.info, ownerId, row.id);
            cards.push(single);
        }

        return cards;
    }



}