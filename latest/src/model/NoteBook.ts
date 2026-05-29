import Deck from "./Deck.ts";

export  default class NoteBook {

    #courses: Array<Deck>;

    constructor() {
        //TODO for now initialize empty later on need to fetch from database that a whole other problem, In comp2452 I fetched in a really round about way
        this.#courses = new Array<Deck>();
    }

    #checkNoteBook(): void{
        //Invariants

    }
}