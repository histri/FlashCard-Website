//handles the deck operations like adding/deleting cards

import Deck from "../model/Deck.ts";
import deckMenuView from "../view/deck-menu-view.ts";
import createCardView from "../view/create-card-view.ts";
import FlashCard from "../model/FlashCard.ts";

export default class DeckController {

    #givenDeck: Deck;
    #deckView: deckMenuView;
    #createCardView?: createCardView;
    constructor(deck:Deck) {
        this.#givenDeck = deck;
        this.#deckView = new deckMenuView(this.#givenDeck, this);

    }

    //Typical controller things todo
    showCreateCardView() {
        if(this.#createCardView === undefined) {
            this.#createCardView = new createCardView(this);
        }
    }

    addToDeck(title:string, info: string): void {
        let card = new FlashCard(title, info);
        this.#givenDeck.addCard(card);
        this.#createCardView = undefined;
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