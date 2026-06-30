import Deck from "./Deck.ts";
import type Listener from "./Listener.ts";

export  default class NoteBook {
    #id: number;
    #courses: Array<Deck>;
    #numOfCourses: number;
    #listeners: Array<Listener>;

    constructor() {
        //TODO for now initialize empty later on need to fetch from database that a whole other problem, In comp2452 I fetched in a really round about way
        this.#courses = new Array<Deck>();
        this.#numOfCourses = 0;
    }

    //TODO franklin mentioned that it is possible to have multiple listeners check that out
    //Notifies all the listeners
    #notifyAll() {
        this.#listeners.forEach((l) => l.notify());
        //TODO it would be a good idea to save the info to database on each notify
    }

    //register other code that can listen to us
    registerListener(listener: Listener) {
        this.#listeners.push(listener);
        //check invariants
        this.#checkNoteBook();
    }


    #checkNoteBook(): void{
        //Invariants

    }
}