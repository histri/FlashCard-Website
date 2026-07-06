import type FlashCard from "./FlashCard.ts";
import {assert} from "../assertions.ts";
import {InvalidNameException} from "./exceptions.ts";

//Instances of this class serve as decks of cards that user can go through.
//TODO future feature to copy cards, transfer from one deck to another
export default class Deck {
    #name: string;
    #id: number;            //will probably be given by database
    cards: Array<FlashCard>;
    #numberOfCards: number;
    constructor(name:string) {
        this.#name = name;
        if (this.#name.length === 0) {
            throw new InvalidNameException;
        }
        this.cards = new Array<FlashCard>();

    }

    checkDeck(): void {
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