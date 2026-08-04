//This is a controller for the features realted to the notebook - making new courses deleting, managing the accoutn

import NoteBook from "../model/NoteBook.ts";
import NoteView from "../view/notebook-view.ts";
import Deck from "../model/Deck.ts";
import DeckController from "./deck-controller.ts";

export default class NotebookController {

    #notebook: NoteBook;
    #deckController: DeckController|null;
    #notebookView: NoteView;

    private constructor(notebook: NoteBook) {
        this.#notebook = notebook;
        this.#notebookView = new NoteView(this.#notebook, this);
        this.#deckController = null;
    }

    static async build(): Promise<NotebookController> {
        //the controller doesnt know anything about how the Notebook gets built
        const notebook = await NoteBook.build();
        return new NotebookController(notebook);
    }

    //Adds a new deck to the current notebook
    //Decks hold flashcards, currently decks property is only its name
    async addDeck(deckName: string): Promise<void> {
        let deck = await Deck.build(deckName,this.#notebook.id!);
        this.#notebook.addDeck(deck);
        this.#notebookView.listenToDeck(deck);
    }

    //The user can enter a deckmenu - this creates a new deck controller and deck menu view
    //      the notebook menu isn't deleted just made "invisible"
    openDeck(deck:Deck): void {

        this.#notebookView.hide();
        this.#deckController = new DeckController(deck, this);      //want the controller to know about its parent so passing it on

    }

    //The user leaves the deck returning to the notebook view
    //      in order to avoid bloat from multiple decks existing simultaneously and listening to changes that won't happen
    //      delete the deck controller and deck menu view, unregister the view as a listener to the Deck instance
    exitDeck(): void {
        //Destroy deck controller
        //TODO I am not a big fan of the fact the destroy command need to propagate all the way through the controller and each view
        //      maybe there is a better way to do it
        this.#notebookView.show();
    }

    // deleteDeck(deck:Deck): void {
    //
    // }


}