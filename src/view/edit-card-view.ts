//Ask for a card to edit (if cards exist)- lets the user change the title/info of the card as long as it is still valid

import DeckController from "../controller/deck-controller.ts";
import type FlashCard from "../model/FlashCard.ts";
import {
    CardNotFoundException,
    DuplicateException,
    InvalidInfoException,
    InvalidNameException
} from "../model/exceptions.ts";

export default class EditCardView  {


    #card?: FlashCard;          // the card currently being edited
    #cardTitle?: string;
    #controller: DeckController;
    #selectCardDialog: HTMLDialogElement;
    #editCardDialog: HTMLDialogElement;

    constructor(controller: DeckController) {
        this.#controller = controller;

        this.#selectCardDialog = document.createElement("dialog");
        this.#selectCardDialog.id = "SelectCardToEdit";
        this.#selectCardDialog.innerHTML = `
            <span id="error"></span><br />  
            <h2>Enter the name of the Card to edit</h2>
             <!-- Should still have a label for accesibility make it look nicer though -->
             <input type="text" id="card-title" placeholder="Card Title"/>
             <div class="dialog-buttons">
             <button id = "EditCardBtn">Edit</button>
                <button id = "closeBtn">Close</button>
             </div>
               
        `
        //TODO select card interface?
        //Submit input for selecting the card
        this.#selectCardDialog.querySelector("#EditCardBtn")!.
        addEventListener("click", () => {this.#selectCardToEdit();});

        this.#selectCardDialog.querySelector("#closeBtn")!.
        addEventListener("click", () => {this.#closeSelectDialog();});

        this.#editCardDialog = document.createElement("dialog");
        this.#editCardDialog.id = "EditCardDialog";
        this.#editCardDialog.innerHTML = `
            <span id="error"></span><br />
            <h2>Edit Card</h2>
            <!-- Should still have a label for accesibility make it look nicer though -->
            
            <input type="text" id="edit-title" placeholder="Card Title"/>
            <!-- Should still add a nice label --> 
            <textarea id="edit-info" rows="5" placeholder="Card Info"></textarea>
            <div class="dialog-buttons">
                <button id="saveCardBtn">Save</button>
                <button id="closeBtn">Close</button>
            </div>
            
        `;

        this.#editCardDialog.querySelector("#saveCardBtn")!.
        addEventListener("click", () => {this.#editCard();});

        //pressing enter also saves the changes for card
        this.#editCardDialog.querySelector<HTMLInputElement>("#edit-title")!.
        addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                this.#editCard();
            }
        });

        this.#editCardDialog.querySelector("#closeBtn")!.
        addEventListener("click", () => {this.#closeEditDialog();});
        document.body.appendChild(this.#selectCardDialog);
        document.body.appendChild(this.#editCardDialog);
        //show the dialog to select the card to edit
        this.#selectCardDialog.showModal();

    }

    #selectCardToEdit(){

        let title = this.#selectCardDialog
            .querySelector<HTMLInputElement>("input#card-title")!.value;
        title = title.trim();
        try {

            //get the card  to edit - or exception if it doesnt exist
            this.#card = this.#controller.findCardByTitle(title);
            this.#cardTitle = this.#card.titleSide; // keep the original title as our lookup key
            // pre-fill the edit dialog with existing values
            this.#editCardDialog.querySelector<HTMLInputElement>("#edit-title")!.value = this.#card.titleSide;
            this.#editCardDialog.querySelector<HTMLInputElement>("#edit-info")!.value = this.#card.infoSide;
            //Now show the dialog to actually edit the card
            this.#selectCardDialog.close();
            this.#editCardDialog.showModal();
        } catch (e: any) {
            if (e instanceof CardNotFoundException) {
                this.#selectCardDialog.querySelector<HTMLInputElement>("#card-title")!
                    .setAttribute('style', 'border-color:red;');
                this.#selectCardDialog.querySelector("#error")!
                    .textContent = "No card found with that title.";
            } else {
                console.log("Unexpected error");
            }
        }

    }

    //
    async#editCard(){
        //the user could have technically leave the input the same as it was
        let newTitle = this.#editCardDialog
            .querySelector<HTMLInputElement>("#edit-title")!.value.trim();
        //don't care what it is as long as not blank
        let newInfo = this.#editCardDialog
            .querySelector<HTMLInputElement>("textarea#edit-info")!.value.trim();
        try{
            this.#controller.updateCard(this.#cardTitle!, newTitle, newInfo);
            this.#editCardDialog.close();
            this.#controller.closeEditCardView();
        }catch(e: any){
            if (e instanceof InvalidNameException) {
                this.#editCardDialog.querySelector<HTMLInputElement>("#edit-title")!
                    .setAttribute('style', 'border-color:red;');
                this.#editCardDialog.querySelector("#error")!
                    .textContent = "Invalid title, titles must have at least one letter.";
            } else if (e instanceof InvalidInfoException) {
                this.#editCardDialog.querySelector<HTMLInputElement>("#edit-info")!
                    .setAttribute('style', 'border-color:red;');
                this.#editCardDialog.querySelector("#error")!
                    .textContent = "Invalid info, info must have at least one letter.";
            } else if (e instanceof DuplicateException) {
                this.#editCardDialog.querySelector<HTMLInputElement>("#edit-title")!
                    .setAttribute('style', 'border-color:red;');
                this.#editCardDialog.querySelector("#error")!
                    .textContent = "Another card already has that title.";
            } else {
                console.log("Unexpected error");
            }
        }


    }
    #closeSelectDialog(): void {
        this.#selectCardDialog.querySelector<HTMLInputElement>("#card-title")!.value = "";
        this.#selectCardDialog.close();
        this.#controller.closeEditCardView();
    }

    #closeEditDialog(): void {
        this.#editCardDialog.querySelector<HTMLInputElement>("#edit-title")!.value = "";
        this.#editCardDialog.querySelector<HTMLInputElement>("#edit-info")!.value = "";
        this.#editCardDialog.close();
        this.#controller.closeEditCardView();
    }


}