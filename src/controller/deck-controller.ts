//handles the deck operations like adding/deleting cards

import Deck from "../model/Deck.ts";
import deckMenuView from "../view/deck-menu-view.ts";

export default class DeckController {

    #givenDeck: Deck;
    #deckView: deckMenuView;
    constructor(deck:Deck) {
        this.#givenDeck = deck;
        this.#deckView = new deckMenuView(this.#givenDeck, this);

    }

    //Typical controller things todo

    addToDeck(): void {

    }


}