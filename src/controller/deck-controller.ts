//handles the deck operations like adding/deleting cards

import Deck from "../model/Deck.ts";
import deckMenuView from "../view/deck-menu-view.ts";
import createCardView from "../view/create-card-view.ts";
import FlashCard from "../model/FlashCard.ts";
import DisplayCardsView from "../view/Display-cards-view.ts";

export default class DeckController {

    #givenDeck: Deck;
    #deckView: deckMenuView;
    #createCardView?: createCardView;
    #viewCards?: DisplayCardsView;
    constructor(deck:Deck) {
        this.#givenDeck = deck;
        this.#deckView = new deckMenuView(this.#givenDeck, this);

    }

    //Create card view is a pop up dialog
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

    //View cards is a separate screen
    //Just toggle between the deck and card view don't destroy either one
    viewCards(): void {
        //Temp fix to a bug might try finding a better solution
        //Not letting user enter flashcard view if the deck is empty
        if(this.#givenDeck.size >0) {
            this.#deckView.hide();
            if (this.#viewCards === undefined) {
                this.#viewCards = new DisplayCardsView(this.#givenDeck, this);
            } else {
                this.#viewCards.show();
            }
        }else{
            console.log("Can't view cards if hte deck is empty")
        }

    }

    //Close the view for flipping through flashcards, go back to the deck menu view.
    //Both views already exist - just toggle visibility, don't recreate either one.
    exitViewCards():void{
        this.#viewCards?.hide();
        this.#deckView.show();
    }

    editCards():void{
        //todo
    }

    //Call this only when the user is leaving this deck entirely (e.g. going
    //back to a list of all decks).
    // views are torn down and listeners unregistered, as opposed to
    destroy(): void {
        this.#deckView.destroy();
        this.#viewCards?.destroy();         //does nothing if hte viewCards is undefined
    }


}