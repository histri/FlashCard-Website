
//need controller and model
//This view implements the listener interface
//TODO currently when pressing the add deck button the dialog is unable to open again
import NotebookController from "../controller/notebook-controller.ts";
import type NoteBook from "../model/NoteBook.ts";
import {InvalidNameException} from "../model/exceptions.ts";
import type Deck from "../model/Deck.ts";

export default class NoteView {
    #controller: NotebookController
    #note: NoteBook;
    #title: HTMLHeadingElement;
    #addDeckDialog: HTMLDialogElement;
    #addDeckButton: HTMLButtonElement;
    #decksEl: HTMLUListElement;
    #selectDeck: HTMLSelectElement;

    constructor(note: NoteBook, controller: NotebookController) {
        //tie controller and model object to this specific view
        this.#note = note;
        this.#controller = controller;

        this.#note.registerListener(this);

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

        this.#decksEl = document.createElement("ul");
        this.#decksEl.id = "decksEl";

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
        document.body.appendChild(this.#decksEl);



        //TODO add an event listener to this



    }

    notify(): void{
        //TODO probably want to separate the notify for decks and flashcards etc
        //Now want to display all the Decks we have with some basic info about then
        //and with a button to open that deck
        //TODO deckEL and decksEL are bad names they look too similar
        //with new change display all the decks
        // empty the contents of the list (remove all li within the list)
        this.#decksEl.replaceChildren();
        this.#note.decks.forEach((deck: Deck): void => {
            let deckEl = document.createElement("li");
            deckEl.className = "deck-card";

            const titleEl = document.createElement("h3");
            titleEl.className = "deck-title";
            titleEl.textContent = deck.name;        //should be a bit safer?

            const countEl = document.createElement("p");
            countEl.className = "deck-count";
            countEl.textContent = `${deck.size} cards`;

            const studyBtn = document.createElement("button");
            studyBtn.className = "study-btn";
            studyBtn.textContent = "Study";

            deckEl.append(titleEl, countEl, studyBtn);
            this.#decksEl.appendChild(deckEl);
        });
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