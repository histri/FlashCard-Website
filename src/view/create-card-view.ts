//This view pops up when user clicks create a card in the deckmenu view

import type DeckController from "../controller/deck-controller.ts";
import {DuplicateException, InvalidInfoException, InvalidNameException} from "../model/exceptions.ts";

export default class createCardView {

    #controller: DeckController;
    #dialog: HTMLDialogElement;


    constructor(controller: DeckController) {
        this.#controller = controller;
        //add the dialog details
        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "createCardView";
        //TODO important that not having a label where there is a place holder is bad practice
        this.#dialog.innerHTML = `
            <span id="error"></span><br />     
               <h2>New Card</h2>
               <input type="text" id="card-title" placeholder="Card Title" />
                <textarea id="card-info" rows="5" placeholder="Card Info"></textarea>
                <div class="dialog-buttons">
                   <button id = "addCardBtn">Create</button>
                   <button id = "closeBtn">Close</button>
               </div>
        `;

        //Submit input
        this.#dialog.querySelector("#addCardBtn")!.
            addEventListener("click", () => {this.#addCard()});
        //Close the dialog
        this.#dialog.querySelector("#closeBtn")!.addEventListener("click", () => {
                console.log("Pressed the close button");
                //remove the text the user might have entered before clicking close
                this.#dialog.querySelector<HTMLInputElement>("#card-title")!.value = "";
                this.#dialog.querySelector<HTMLInputElement>("#card-info")!.value = "";
                this.#dialog.close();
                this.#controller.closeCreateCardView();
            });
        //Add to the page
        //TODO make sure this view gets DELETED when closed by controller
        document.body.appendChild(this.#dialog);
        this.#dialog.showModal();

    }


    //Adding a card to a deck
    //Currently card has - title and info side
    async #addCard(): Promise<void> {
        //take the user input
        let title:string = this.#dialog.querySelector<HTMLInputElement>("input#card-title")!.value;
        let infoSide:string = this.#dialog.querySelector<HTMLInputElement>("textarea#card-info")!.value;
        //Trim the trailing space in front and back of text
        title = title.trim();
        infoSide = infoSide.trim();
        try{
            //ask the controller to add a new card with given parameters
            await this.#controller.addToDeck(title, infoSide);
            this.#dialog.close();
            //reset the text dialog values since close doesnt natively do that
            this.#dialog.querySelector<HTMLInputElement>("#card-title")!.value = "";
            this.#dialog.querySelector<HTMLInputElement>("#card-info")!.value = "";
        }catch(e: any){
            if(e instanceof InvalidNameException){
                this.#dialog.querySelector<HTMLInputElement>("#card-title")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("#error")!
                    .textContent = "Invalid title, titles must have at least one letter (e.g., mitochondria).";

            }else if (e instanceof InvalidInfoException){
                this.#dialog.querySelector<HTMLInputElement>("#card-info")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("#error")!
                    .textContent = "Invalid info, info must have at least one letter (e.g., powerhouse of the cell).";

            }else if(e instanceof DuplicateException){
                this.#dialog.querySelector<HTMLInputElement>("#card-title")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("#error")!
                    .textContent = "Invalid title, titles must be unique";
            }else{
                console.log("Unexpected error");
            }
        }

    }

}
