import type Course from "./Course.ts";

export  default class NoteBook {

    #courses: Array<Course>;

    constructor() {
        //TODO for now initialize empty later on need to fetch from database that a whole other problem, In comp2452 I fetched in a really round about way
        this.#courses = new Array<Course>();
    }

    #checkNoteBook(): void{
        //Invariants

    }
}