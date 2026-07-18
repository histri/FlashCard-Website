//Ask for a card to edit (if cards exist)- lets the user change the title/info of the card as long as it is still valid

import DeckController from "../controller/deck-controller.ts";
import type FlashCard from "../model/FlashCard.ts";
import {CardNotFoundException} from "../model/exceptions.ts";

export default class EditCardView  {

    #cardTitle: string;
    #cardInfo: string;
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
             <label for="card-title">Card Title</label>
             <input type="text" id="card-title" />
               <button id = "EditCardBtn">Edit</button>
                <button id = "closeBtn">Close</button>
        `
        //TODO select card interface?
        //Submit input for selecting the card
        this.#selectCardDialog.querySelector("#EditCardBtn")!.
        addEventListener("click", () => {this.#selectCardToEdit();});

        this.#editCardDialog = document.createElement("dialog");
        this.#editCardDialog.id = "EditCardDialog";
        this.#editCardDialog.innerHTML = `
            <span id="error"></span><br />
            <h2>Edit Card</h2>
            <label for="edit-title">Card Title</label>
            <input type="text" id="edit-title" />
            <label for="edit-info">Card Info</label>
            <input type="text" id="edit-info" />
            <button id="saveCardBtn">Save</button>
            <button id="closeBtn">Close</button>
        `;
        this.#editCardDialog.querySelector("#SaveCardBtn")!.
        addEventListener("click", () => {})

        document.body.appendChild(this.#selectCardDialog);
        document.body.appendChild(this.#editCardDialog);
        //show the dialog to select the card to edit
        this.#selectCardDialog.showModal();

    }

    #selectCardToEdit(){
        this.#cardTitle = this.#selectCardDialog
            .querySelector<HTMLInputElement>("input#card-title")!.value;
        this.#cardTitle = this.#cardTitle.trim();

        try {
            //get the card that we want to edit - or exception if it doesnt exist
            const card: FlashCard = this.#controller.findCardByTitle(this.#cardTitle);
            //get the title from the card as well
            this.#cardTitle = card.titleSide;

            // pre-fill the edit dialog with existing values
            this.#editCardDialog.querySelector<HTMLInputElement>("#edit-title")!.value = card.titleSide;
            this.#editCardDialog.querySelector<HTMLInputElement>("#edit-info")!.value = card.infoSide;

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
    #editCard(){
        //the user could have technically leave the input the same as it was
        let newTitle = this.#editCardDialog
            .querySelector<HTMLInputElement>("#edit-title")!.value.trim();
        let newInfo = this.#editCardDialog
            .querySelector<HTMLInputElement>("#edit-info")!.value.trim();

        try{

        }catch(e: any){

        }


    }


}