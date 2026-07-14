//This is a controller for the features realted to the notebook - making new courses deleting, managing the accoutn

import NoteBook from "../model/NoteBook.ts";
import NoteView from "../view/notebook-view.ts";
import Deck from "../model/Deck.ts";
import deckMenuView from "../view/deck-menu-view.ts";
import createCardView from "../view/create-card-view.ts";
import DeckController from "./deck-controller.ts";

export default class NotebookController {

    #notebook: NoteBook;
    #deckController: DeckController;
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
        //TODO if I need the deck controller to talk to Notebook Controller
        // (might need for preview of how many cards in a deck) -> just pass NoteBook Controller as a parameter
        this.#notebookView?.destroy();
        this.#deckController = new DeckController(deck);
        this.#deckController.addToDeck("Card A", "AAA");
        this.#deckController.addToDeck("Card B", "BBB");
        this.#deckController.addToDeck("Card C", "CCC");
        this.#deckController.addToDeck("Card D", "DDD");

    }

    deleteDeck(deck:Deck): void {

    }


}