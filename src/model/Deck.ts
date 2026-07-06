import type FlashCard from "./FlashCard.ts";
import {assert} from "../assertions.ts";
import {InvalidNameException} from "./exceptions.ts";

//Instances of this class serve as decks of cards that user can go through.
//TODO future feature to copy cards, transfer from one deck to another
export default class Deck {
    #name: string;          //name of the deck (ex: Bio)
    #id: number;            //will probably be given by database
    cards: Array<FlashCard>;    //the cards in the deck

    constructor(name:string) {
        //Initialise the name of the deck
        this.#name = name;
        //check preconditions
        if (this.#name.length === 0) {
            throw new InvalidNameException;
        }
        this.cards = new Array<FlashCard>();
        //Check invariants
        this.#checkDeck();
    }

    #checkDeck(): void {
    //Invariants
        assert(this.#name.length > 0, "Names must not be empty")
    }

    get name(): string {
        return this.#name;
    }
    get size() : number {
        return this.cards.length;
    }



}