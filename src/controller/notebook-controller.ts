//This is a controller for the features realted to the notebook - making new courses deleting, managing the accoutn

import NoteBook from "../model/NoteBook.ts";
import NoteView from "../view/notebook-view.ts";
import Deck from "../model/Deck.ts";
import deckMenuView from "../view/deck-menu-view.ts";
import createCardView from "../view/create-card-view.ts";

export default class NotebookController {

    #notebook: NoteBook;
    #notebookView: NoteView;
    #deckMENUview: deckMenuView;
    #createCardView?: createCardView;
    constructor() {
        this.#notebook = new NoteBook();
        this.#notebookView = new NoteView(this.#notebook, this);

    }

    //Adds a new deck to the current notebook
    //Decks hold flashcards, currently decks property is only its name
    addDeck(deckName: string): void {
        let deck = new Deck(deckName);
        this.#notebook.addDeck(deck);
    }

    openDeck(deck:Deck): void {
        //TODO need to check there wasn't a previously created deck view which could disrupt the operation
        this.#deckMENUview = new deckMenuView(deck, this);
    }

    addToDeck(): void {

    }

    showCreateCardView():void {
        if(this.#createCardView == undefined) {
            this.#createCardView = new createCardView(this);
        }
    }

}