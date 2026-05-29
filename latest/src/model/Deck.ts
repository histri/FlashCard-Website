import type FlashCard from "./FlashCard.ts";

//Instances of this class serve as decks of cards that user can go through.
//TODO future feature to copy cards, transfer from one deck to another
export default class Deck {

    #id: number;
    cards: Array<FlashCard>;
    constructor() {

    }

    checkDeck(): void {
    //Invariants
    }

}