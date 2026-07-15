//This screen deletes the selected flahscard
//For now the cards are selected by name, maybe delete in the display-card-view? as a trash icon?
//This is the simplest current implementation I could think of

import DeckController from "../controller/deck-controller.ts";

export default class deleteCardView {

    #controller: DeckController;
    #dialog: HTMLDialogElement;

    constructor(controller: DeckController) {

        this.#controller = controller;
        this.#dialog = new HTMLDialogElement();
        this.#dialog.id = "deleteCardView";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />  
            <h2>Input the name of the Card to delete</h2>
             <label for="card-title">Card Title</label>
             <input type="text" id="card-title" />
               <button id = "deleteCardBtn">Delete</button>
        `
        //Submit input
        this.#dialog.querySelector("#deleteCardBtn")!.
        addEventListener("click", () => {this.#deleteCard();});
    }

    //Local method that sends text input to delete a card

    #deleteCard() {
        let cardTitle:string = this.#dialog.querySelector<HTMLInputElement>("input#card-title")!.value;

        //Ask the controller to find and delete the given card
        try{
            this.#controller.deleteCard(cardTitle);
        }catch(e){

        }

    }



}