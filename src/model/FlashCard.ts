import {InvalidInfoException, InvalidNameException} from "./exceptions.ts";
import {assert} from "../assertions.ts";

export default class FlashCard {
    //Main functionality for the application
    //Each flash card has a title and info side the user studies by
    //      trying to recollect info about a specific title
    //      (ex title - Labrador Retriever, info side - The Labrador Retriever, also known simply as the Labrador or Lab, is a British breed of retriever gun dog)
    //      https://en.wikipedia.org/wiki/Labrador_Retriever
    // The user can input the title and info, flip the card
    //TODO possible future functionality - draw input,


    #id: number;                //for future when woking with DB persistence
    #titleSide: string;             //front side of the card
    #infoSide: string;      //back side of the card that gets revealed later


    constructor(titleSide:string, infoSide:string) {
        //ID will be initialised from database (not set up yet)
        this.#titleSide = titleSide;
        this.#infoSide = infoSide;
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

}