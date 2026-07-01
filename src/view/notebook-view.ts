
//need controller and model
//This view implements the listener interface

import NotebookController from "../controller/notebook-controller.ts";
import type NoteBook from "../model/NoteBook.ts";

export default class NoteView {
    #controller: NotebookController
    #note: NoteBook;
    #title: HTMLHeadingElement;
    #addDeckDialog: HTMLDialogElement;
    #selectDeck: HTMLSelectElement;

    constructor(note: NoteBook, controller: NotebookController) {
        //tie controller and model object to this specific view
        this.#note = note;
        this.#controller = controller;
        //register the view as a listener to the Domain class

        this.#title = document.createElement("h2");
        this.#title.textContent = "Flash Card Study Tool";
        //Todo, need to add a <div> or article element to group things better instead of uppending one at a time.
        this.#addDeckDialog = document.createElement("dialog");
        this.#addDeckDialog.id = "notebook-add-deck";
        //TODO vulnerable to XSS attacks
        this.#addDeckDialog.innerHTML = `
            <p>Enter name of the new Deck</p>
            <label for="nickname">Nickname</label>
           <input type="text" id="nickname" />
           <button>Add New Deck</button>
           <button>Close</button>
        `
        //TODO need to attach an even listener to the "add deck" button
        //TODO the dialog shows up immediatly need it to shop up only on press of a button

        // add to the page:
        document.body.appendChild(this.#addDeckDialog);
        // dialogs are hidden by default, show yourself:
        this.#addDeckDialog.show();
        //example taken from Comp 2452
//         this.#dialog = document.createElement("dialog");
//         this.#dialog.id = "add-pokemon-dialog";
//         this.#dialog.innerHTML = `
//       <span id="error"></span><br />
//       <label for="initialHp">Initial HP</label>
//       <input type="number" id="initialHp" />
//       <label for="nickname">Nickname</label>
//       <input type="text" id="nickname" />
//       <button>Add Pok&eacute;mon</button>
// `
        //TODO add an event listener to this

        document.body.appendChild(this.#title);

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