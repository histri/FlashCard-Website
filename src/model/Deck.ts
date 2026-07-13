import type FlashCard from "./FlashCard.ts";
import {assert} from "../assertions.ts";
import {InvalidNameException} from "./exceptions.ts";
import type Listener from "./Listener.ts";

//Instances of this class serve as decks of cards that user can go through.
//TODO future feature to copy cards, transfer from one deck to another
export default class Deck {
    #name: string;          //name of the deck (ex: Bio)
    #id: number;            //will probably be given by database
    #cards: Array<FlashCard>;    //the cards in the deck
    //TODO should I really register listeners if there is only one view attached
    #listeners: Array<Listener>;
    constructor(name:string) {
        //Initialise the name of the deck
        this.#name = name;
        //check preconditions
        if (this.#name.length === 0) {
            throw new InvalidNameException;
        }
        this.#cards = new Array<FlashCard>();
        this.#listeners = new Array<Listener>();
        //Check invariants
        this.#checkDeck();
    }

    #checkDeck(): void {
    //Invariants
        assert(this.#name.length > 0, "Names must not be empty")
    }

    //register all the things that will be listening to the notebook
            //currently just the deck-menu-view, but could also be the notebook view
            //considering that it will display how many flashcards each deck has for example

    registerListener(listener: Listener): void {
        this.#listeners.push(listener);
        //check invariants
        this.#checkDeck();
    }

    unregisterListener(listener: Listener): void {
        //TODO not sure about how to remove a specific class instance in TS
    }

    #notifyAll() {
        this.#listeners.forEach((l) => l.notify());
        //TODO it would be a good idea to save the info to database on each notify
    }


    get name(): string {
        return this.#name;
    }
    get cards (): Array<FlashCard> {
        return this.#cards;
    }
    get size() : number {
        return this.#cards.length;
    }

    //Current methods that I want to implement

    //Add a card to the deck
    //not sure about paramters yet, maybe name or number(id) of the deck
    //return boolean - whether operation was successful
    addCard(card : FlashCard): void{
        this.#cards.push(card);
        //TODO persist data
        //Notify all listeners
        this.#notifyAll();
    }


    removeCard(): boolean {
        //
        return false;
    }



}