//This is a controller for the features realted to the notebook - making new courses deleting, managing the accoutn

import NoteBook from "../model/NoteBook.ts";
import NoteView from "../view/notebook-view.ts";
import Deck from "../model/Deck.ts";
import DeckController from "./deck-controller.ts";
import  LoginView from "../view/login-view.ts";

export default class NotebookController {

    #notebook?: NoteBook;
    #deckController: DeckController|null;
    #userView: LoginView;
    #notebookView?: NoteView;

    //changed my mind again about private constructor for this builder
    constructor() {
        this.#deckController = null;
        this.#userView = new LoginView(this);
    }

    //Called from the "Create Account" dialog - fails if that username is already taken
    async createUser(username: string): Promise<void> {
        const n: NoteBook = await NoteBook.create(username);
        this.#finishLogin(n);
    }

    //Called from the "Log In" dialog - fails if no account exists with that username
    async logInUser(username: string): Promise<void> {
        const n: NoteBook = await NoteBook.login(username);
        this.#finishLogin(n);
    }

    //Shared by both flows above: store the notebook, tear down the login screen,
    //  and hand off to the notebook view
    #finishLogin(n: NoteBook): void {
        this.#notebook = n;
        this.#userView.hide();
        this.#notebookView = new NoteView(n, this);
    }


    //Adds a new deck to the current notebook
    //Decks hold flashcards, currently decks property is only its name
    async addDeck(deckName: string): Promise<void> {
        let deck = await Deck.build(deckName,this.#notebook!.id!);
        this.#notebook!.addDeck(deck);
        this.#notebookView!.listenToDeck(deck);
    }

    //The user can enter a deckmenu - this creates a new deck controller and deck menu view
    //      the notebook menu isn't deleted just made "invisible"
    openDeck(deck:Deck): void {
        this.#notebookView!.hide();
        this.#deckController = new DeckController(deck, this);      //want the controller to know about its parent so passing it on

    }

    //The user leaves the deck returning to the notebook view
    //      in order to avoid bloat from multiple decks existing simultaneously and listening to changes that won't happen
    //      delete the deck controller and deck menu view, unregister the view as a listener to the Deck instance
    exitDeck(): void {
        //Destroy deck controller
        //TODO I am not a big fan of the fact the destroy command need to propagate all the way through the controller and each view
        //      maybe there is a better way to do it
        this.#notebookView!.show();
    }

    // deleteDeck(deck:Deck): void {
    //
    // }


}