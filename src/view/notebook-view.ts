
//need controller and model
//This view implements the listener interface

import NotebookController from "../controller/notebook-controller.ts";
import type NoteBook from "../model/NoteBook.ts";

export default class NoteView {
    #controller: NotebookController
    #note: NoteBook;
    #title: HTMLHeadingElement;
    #addDeckBtn: HTMLButtonElement;
    #selectDeck: HTMLSelectElement;

    constructor(note: NoteBook, controller: NotebookController) {
        //tie controller and model object to this specific view
        this.#note = note;
        this.#controller = controller;
        //register the view as a listener to the Domain class

        this.#title = document.createElement("h2");
        this.#title.textContent = "Flash Card Study Tool";
        //Todo, need to add a <div> or article element to group things better instead of uppending one at a time.

        this.#addDeckBtn = document.createElement("button");
        this.#addDeckBtn.textContent = "Add a new Deck";
        this.#addDeckBtn.addEventListener("click", () => this.#controller.addDeck());
        //TODO add an event listener to this

        document.body.appendChild(this.#title);
        document.body.appendChild(this.#addDeckBtn);
    }

    notify(): void{

    }

    //Each deck preview inside the notebookview class would look something like
    // <div class="deck-card" data-deck-id="123">
    //   <h3 class="deck-title">Spanish Vocab</h3>
    //   <p class="deck-count">24 cards</p>
    //   <button class="study-btn">Study</button>
    // </div>

}