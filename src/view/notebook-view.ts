
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
    #root: HTMLDivElement;
    #title: HTMLHeadingElement;
    #addDeckDialog: HTMLDialogElement;
    #addDeckButton: HTMLButtonElement;
    #decksEl: HTMLUListElement;

    constructor(note: NoteBook, controller: NotebookController) {
        //tie controller and model object to this specific view
        this.#note = note;
        this.#controller = controller;
        this.#note.registerListener(this);

        this.#root = document.createElement("div");

        this.#title = document.createElement("h2");
        this.#title.textContent = "Flash Card Study Tool";

        //Flow user clicks button to add a new deck, after that a new dialog shows up where user enters new details
        this.#addDeckButton = document.createElement("button");
        this.#addDeckButton.textContent = "Add Deck";
        this.#addDeckButton.addEventListener("click", () => {this.#addDeckDialog.showModal();})

        //Dialog
        //Todo, need to add a <div> or article element to group things better instead of uppending one at a time.
        this.#addDeckDialog = document.createElement("dialog");
        this.#addDeckDialog.id = "notebook-add-deck";
        //TODO vulnerable to XSS attacks?

        //TODO maybe move the create deck dialog into its own view?
        this.#addDeckDialog.innerHTML = `
               <span id="error"></span><br />
               <h2>New Deck</h2>
               <label for="deck-name">Deck Name</label>
               <input type="text" id="deck-name" />
               <button id = "addDeckBtn">Create</button>
               <button id = "closeDeckBtn">Close</button> 
        `;

        this.#decksEl = document.createElement("ul");
        this.#decksEl.id = "decksEl";

        //Submit input
        this.#addDeckDialog.querySelector("#addDeckBtn")!.
        addEventListener("click", () => {this.#addDeck()});
        //Close the dialog
        this.#addDeckDialog.querySelector("#closeDeckBtn")!.
        addEventListener("click", () => {
            //remove the text the user might have entered before clicking close
            this.#addDeckDialog.querySelector<HTMLInputElement>("#deck-name")!.value = "";
            this.#addDeckDialog.close()});

        //TODO append or appendChild??
        this.#root.append(this.#title, this.#addDeckButton, this.#addDeckDialog, this.#decksEl) ;
        document.querySelector("#app")!.appendChild(this.#root);

        this.notify();
    }
    //I dont like that adding a card which just changes one HTML element rewrites the entire page(which is hidden in some cases)
    listenToDeck(deck:Deck) {
        deck.registerListener(this);
    }

    notify(): void{
        //TODO probably want to separate the notify for decks and flashcards etc
        //Now want to display all the Decks we have with some basic info about then
        //and with a button to open that deck
        //TODO deckEL and decksEL are bad names they look too similar
        //with new change display all the decks
        // empty the contents of the list (remove all li within the list)
        //TODO this seems really inefficient to keep removing all the children before just reinputting them and one more deck
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
            studyBtn.addEventListener("click", () => {this.#controller.openDeck(deck);})



            deckEl.append(titleEl, countEl, studyBtn);
            this.#decksEl.appendChild(deckEl);
        });
    }


    /// When user enters a deck, don't delete the deck, instead make the deck "invisible"

    //Make the view visible again. Use this for back forth navigation in deck menu
    show(): void {
        this.#root.style.display = "";
    }

    //Hide the view without destroying it or unregistering the listener.
    hide(): void {
        this.#root.style.display = "none";
    }

    #addDeck(){

        let name = this.#addDeckDialog.querySelector<HTMLInputElement>("#deck-name")!.value;
        //trim the spaces around the name of deck
        name = name.trim();
        try{
            this.#controller.addDeck(name);
            //assuming success remove the dialog from the page
            //TODO if a user hits an invalid name, closes, reopens,
            // the old error message will still be there until they fail again.
            this.#addDeckDialog.close();
            this.#addDeckDialog.querySelector<HTMLInputElement>("#deck-name")!.value = "";
        }catch(e : any){
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