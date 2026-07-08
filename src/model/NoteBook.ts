import Deck from "./Deck.ts";
import type Listener from "./Listener.ts";

//Main Domain class in the current hierarchy NoteBook > Deck > Cards

export  default class NoteBook {
    #id: number;                //current not used, could be used in case of multiple accounts
    #decks: Array<Deck>;        //array of card decks that the notebook has
    #numOfDecks: number;      //just size of the deck array
    #listeners: Array<Listener>;    //listeners listen to the updates on this domain class


    constructor() {
        //TODO for now initialize empty later on need to fetch from database that a whole other problem, In comp2452 I fetched in a really round about way
        this.#decks = new Array<Deck>();
        this.#listeners = new Array<Listener>();
        //check assertions
        this.#checkNoteBook()
    }

    //TODO make more specific listeners the notify here should probably only apply to notebook view
    //Notifies all the listeners
    #notifyAll() {
        this.#listeners.forEach((l) => l.notify());
        //TODO it would be a good idea to save the info to database on each notify
    }

    //register other code that can listen to it
    registerListener(listener: Listener) {
        this.#listeners.push(listener);
        //check invariants
        this.#checkNoteBook();
    }

    //Check domain class invariants
    #checkNoteBook(): void{
        //Invariants
        //currently aren't any
    }

    //Let user add a new deck to their notebook
    //TODO maybe make it return a boolean for success
    addDeck(deck: Deck): void {
        this.#decks.push(deck);
        //notify the listeners that the domain class has changed
        this.#notifyAll();
    }

    deleteDeck(deck: Deck): void {
        //TODO implement
    }

    /*
            GETTERS
    */

    get decks(): Array<Deck> {
        return this.#decks;
    }

}