
//need controller and model
//This view implements the listener interface
//TODO currently when pressing the add deck button the dialog is unable to open again
import NotebookController from "../controller/notebook-controller.ts";
import type NoteBook from "../model/NoteBook.ts";
import {InvalidNameException} from "../model/exceptions.ts";

export default class NoteView {
    #controller: NotebookController
    #note: NoteBook;
    #title: HTMLHeadingElement;
    #addDeckDialog: HTMLDialogElement;
    #addDeckButton: HTMLButtonElement;
    #selectDeck: HTMLSelectElement;

    constructor(note: NoteBook, controller: NotebookController) {
        //tie controller and model object to this specific view
        this.#note = note;
        this.#controller = controller;

        //TODO register the view as a listener to the Domain class

        this.#title = document.createElement("h2");
        this.#title.textContent = "Flash Card Study Tool";

        //Flow user clicks button to add a new deck, after that a new dialog shows up where user enters new details
        this.#addDeckButton = document.createElement("button");
        this.#addDeckButton.textContent = "Add Deck";
        this.#addDeckButton.addEventListener("click", () => {this.#addDeckDialog.showModal();})

        //Todo, need to add a <div> or article element to group things better instead of uppending one at a time.
        this.#addDeckDialog = document.createElement("dialog");
        this.#addDeckDialog.id = "notebook-add-deck";
        //TODO vulnerable to XSS attacks
        this.#addDeckDialog.innerHTML = `
               <span id="error"></span><br />
               <h2>New Deck</h2>
               <label for="deck-name">Deck Name</label>
               <input type="text" id="deck-name" />
               <button id = "addDeckBtn">Create</button>
               <button id = "closeDeckDialog">Close</button> 
        `;
        //Submit input
        this.#addDeckDialog.querySelector("#addDeckBtn")!.
        addEventListener("click", () => {this.#addDeck()});
        //Close the dialog
        this.#addDeckDialog.querySelector("#closeDeckDialog")!.
        addEventListener("click", () => {this.#addDeckDialog.close()});

        //TODO need to attach an event listener to the "add deck" button
        // add to the page:
        document.body.appendChild(this.#title);
        document.body.appendChild(this.#addDeckButton);
        document.body.appendChild(this.#addDeckDialog);


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



    }

    notify(): void{
        //TODO Important for main screen
        //Now want to display all the Decks we have with some basic info about then
        //and with a button to open that deck

    }

    #addDeck(){
        let name = this.#addDeckDialog.querySelector<HTMLInputElement>("#deck-name")!.value;

        try{
            this.#controller.addDeck(name);
            //assuming success remove the dialog from the page
            //TODO if a user hits an invalid name, closes, reopens,
            // the old error message will still be there until they fail again.
            this.#addDeckDialog.close();
        }catch(e){
            //handle specific exceptions
            if(e instanceof InvalidNameException){
                this.#addDeckDialog.querySelector<HTMLInputElement>("#deck-name")!
                    .setAttribute('style', 'border-color:red;');
                this.#addDeckDialog.querySelector("#error")!
                    .textContent = "Invalid name, names must have at least one letter (e.g., Bio).";
            }else{
                console.log("Unexpected error");
            }
        }
    }

    //Each deck preview inside the notebookview class would look something like
    // <div class="deck-card" data-deck-id="123">
    //   <h3 class="deck-title">Spanish Vocab</h3>
    //   <p class="deck-count">24 cards</p>
    //   <button class="study-btn">Study</button>
    // TODO but how to differentiate the <button> elements on eahc of the decks the user will see???
    // </div>

}