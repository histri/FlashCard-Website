
//need controller and model
//This view implements the listener interface

import NotebookController from "../controller/notebook-controller.ts";
import type NoteBook from "../model/NoteBook.ts";

export default class NoteView {
    #controller: NotebookController
    #note: NoteBook;
    #title: HTMLHeadingElement;
    #addDeckBtn: HTMLButtonElement;

    constructor(note: NoteBook, controller: NotebookController) {
        //tie controller and model object to this specific view
        this.#note = note;
        this.#controller = controller;
        //register the view as a listener to the Domain class

        this.#title = document.createElement("h2");
        this.#title.textContent = "Flash Card Study Tool";
        //Todo, need to add a <div> or article element to group things better instead of uppending one at a time.
        //TODO, need to add a button element
        document.body.appendChild(this.#title);


    }

    notify(): void{

    }


}