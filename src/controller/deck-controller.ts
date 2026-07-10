//handles the deck operations like adding/deleting cards

import Deck from "../model/Deck.ts";
import deckMenuView from "../view/deck-menu-view.ts";
import createCardView from "../view/create-card-view.ts";
import FlashCard from "../model/FlashCard.ts";
import DisplayCardsView from "../view/Display-cards-view.ts";

export default class DeckController {

    #givenDeck: Deck;
    #deckView?: deckMenuView;
    #createCardView?: createCardView;
    #viewCards?: DisplayCardsView;
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
        //Temp fix to a bug might try finding a better solution
        //Not letting user enter flashcard view if the deck is empty
        if(this.#givenDeck.size >0) {
            this.#deckView = undefined;
            if (this.#viewCards === undefined) {
                this.#viewCards = new DisplayCardsView(this.#givenDeck, this);
            }
        }else{
            console.log("Can't view cards if hte deck is empty")
        }

    }

    //Close the view for flipping through flashcards, go back to the deck menu view
    //TODO this approach is really bad I can already forsee all the technical debt that will come
    //      from deleting and rendering the menu and flashcard view over and over again
    //      Especially since it registers itself as a listener this will be a HUGE problem
    //      address as quickly as possible
    exitViewCards():void{
        this.#viewCards = undefined;
        this.#deckView = new deckMenuView(this.#givenDeck, this);
    }

    editCards():void{
        //todo
    }


}