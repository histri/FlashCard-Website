//This is a controller for the features realted to the notebook - making new courses deleting, managing the accoutn

import NoteBook from "../model/NoteBook.ts";
import NoteView from "../view/notebook-view.ts";
import Deck from "../model/Deck.ts";

export default class NotebookController {

    #notebook: NoteBook;
    #notebookView: NoteView;
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
}