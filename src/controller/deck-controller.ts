//handles the deck operations like adding/deleting cards

import Deck from "../model/Deck.ts";
import deckMenuView from "../view/deck-menu-view.ts";
import type createCardView from "../view/create-card-view.ts";

export default class DeckController {

    #givenDeck: Deck;
    #deckView: deckMenuView;
    #createCardView: createCardView;
    constructor(deck:Deck) {
        this.#givenDeck = deck;
        this.#deckView = new deckMenuView(this.#givenDeck, this);

    }

    //Typical controller things todo

    addToDeck(): void {
        //todo
    }

    deleteCard(): void {
        //todo
    }

    exitDeckMenu(): void {
        //todo
    }

    viewCards(): void {
        //todo
    }


    showCreateCard(){
        if(this.#createCardView == undefined){
            this.#createCardView = new createCardView(this);
        }
    }


}