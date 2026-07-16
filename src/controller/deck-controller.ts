//handles the deck operations like adding/deleting cards

import Deck from "../model/Deck.ts";
import deckMenuView from "../view/deck-menu-view.ts";
import createCardView from "../view/create-card-view.ts";
import FlashCard from "../model/FlashCard.ts";
import DisplayCardsView from "../view/Display-cards-view.ts";
import  NotebookController from "./notebook-controller.ts";
import deleteCardView from "../view/delete-card-view.ts";

export default class DeckController {

    #givenDeck: Deck;                       //the deck instance we give commands to
    #deckView: deckMenuView;                //the deck menu view through which user interact with controller
    #createCardView?: createCardView;        //dialog for creating a card
    #deleteCardView?: deleteCardView;           //dialog for deleting a card
    #viewCards?: DisplayCardsView;             //New view to specifically look thorough cards
    #notebookController: NotebookController;       //reference back to the parent controller

    constructor(deck:Deck, noteController: NotebookController) {
        this.#givenDeck = deck;
        this.#deckView = new deckMenuView(this.#givenDeck, this);
        this.#notebookController = noteController;
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


    showDeleteCardView() {
        if(this.#deleteCardView === undefined) {
            this.#deleteCardView = new deleteCardView(this);
        }
    }

    //TODO lowkey dont need this method
    closeDeleteCardView(){
        this.#deleteCardView = undefined;
    }
    //For this to work must assume all cards have unique names
    deleteCard(title:string): void {
        this.#givenDeck.removeCard(title);
        this.closeDeleteCardView();
    }

    //Leaves the deck menu, (basically deletes it) unregisters it as a listener to the specific deck instance (TODO) is unregistering really that necessary

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

    //Leaves the deck menu, (basically deletes it) unregisters it as a listener to the specific deck instance (TODO) is unregistering really that necessary
    exitDeckMenu(): void{
        this.#destroy();
        this.#notebookController.exitDeck();
    }

    //Call this only when the user is leaving this deck entirely (e.g. going
    //back to a list of all decks).
    // views are torn down and listeners unregistered, as opposed to just hidden
    #destroy(): void {
        this.#deckView.destroy();
        this.#viewCards?.destroy();         //does nothing if hte viewCards is undefined
    }


}