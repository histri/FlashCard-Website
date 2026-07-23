//This screen deletes the selected flahscard
//For now the cards are selected by name, maybe delete in the display-card-view? as a trash icon?
//This is the simplest current implementation I could think of

import DeckController from "../controller/deck-controller.ts";
import {CardNotFoundException} from "../model/exceptions.ts";

export default class deleteCardView {

    #controller: DeckController;
    #dialog: HTMLDialogElement;

    //TODO using the same label in both create and delete card hopefully that isn't a problem
    constructor(controller: DeckController) {

        this.#controller = controller;
        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "deleteCardView";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />  
            <h2>Input the name of the Card to delete</h2>
            <!--Should still probably have a label for accesibility --> 
             <input type="text" id="card-title" placeholder="Card Title" />
               <button id = "deleteCardBtn">Delete</button>
                <button id = "closeBtn">Close</button>
        `
        //Submit input
        this.#dialog.querySelector("#deleteCardBtn")!.
        addEventListener("click", () => {this.#deleteCard();});
        //Close the dialog
        this.#dialog.querySelector("#closeBtn")!.addEventListener("click", () => {
            //remove the text the user might have entered before clicking close
            this.#dialog.querySelector<HTMLInputElement>("#card-title")!.value = "";
            this.#dialog.close();
            this.#controller.closeDeleteCardView();
        });
        //Add to the page
        document.body.appendChild(this.#dialog);
        this.#dialog.showModal();
    }

    //Local method that sends text input to delete a card

    #deleteCard() {
        let cardTitle:string = this.#dialog.querySelector<HTMLInputElement>("input#card-title")!.value;
        //Trim the spaces around the input - not an issue since creating a card also trims spaces
        cardTitle = cardTitle.trim();

        //Ask the controller to find and delete the given card
        try{
            this.#controller.deleteCard(cardTitle);
            //TODO not sure the order is correct of the 2 lines
            this.#dialog.close();
            //reset the text dialog values since close doesnt natively do that
            this.#dialog.querySelector<HTMLInputElement>("#card-title")!.value = "";

        }catch(e){
            if(e instanceof CardNotFoundException){
                this.#dialog.querySelector<HTMLInputElement>("#card-title")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("#error")!
                    .textContent = "Invalid title, titles must have at least one letter (e.g., mitochondria).";
            }else{
                console.log("Unknown error while deleting card");
            }
        }

    }



}