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

    //Show the create Card dialog where user enters card details
    showCreateCardView() {
        if(this.#createCardView === undefined) {
            this.#createCardView = new createCardView(this);
        }
    }

    //Closes the createCard View - can either be done by user via close btn or submit btn
    //TODO might make a general close View method if having multiple close methods gets bulky
    closeCreateCardView(){
        this.#createCardView = undefined;
    }

    //Add a newly created card to the deck
    addToDeck(title:string, info: string): void {
        let card = new FlashCard(title, info);
        this.#givenDeck.addCard(card);
       this.closeCreateCardView();
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

    editCards():void{
        //todo
    }


}