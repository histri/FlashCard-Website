//This view pops up when user clicks create a card in the deckmenu view

import type DeckController from "../controller/deck-controller.ts";
import {InvalidInfoException, InvalidNameException} from "../model/exceptions.ts";

export default class createCardView {

    #controller: DeckController;
    #dialog: HTMLDialogElement;


    constructor(controller: DeckController) {
        this.#controller = controller;
        //add the dialog details
        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "createCardView";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
               <h2>New Card</h2>
               <label for="card-title">Card Title</label>
               <input type="text" id="card-title" />
               <label for="card-info">Card Info</label>
               <input type="text" id="card-info" />
               <button id = "addCardBtn">Create</button>
               <button id = "closeBtn">Close</button>
        `;

        //Submit input
        this.#dialog.querySelector("#addCardBtn")!.
            addEventListener("click", () => {this.#addCard()});
        //Close the dialog
        this.#dialog.querySelector("#closeBtn")!.
            addEventListener("click", () => {this.#dialog.close()});
        //Add to the page
        //TODO i dont think this is right
        document.body.appendChild(this.#dialog);
        this.#dialog.show();

    }

    notify(): void{

    }
    #addCard(): void {
        let title:string = this.#dialog.querySelector<HTMLInputElement>("input#card-title")!.value;
        let infoSide:string = this.#dialog.querySelector<HTMLInputElement>("input#card-info")!.value;
        try{

        }catch(e: any){
            if(e instanceof InvalidNameException){

            }else if (e instanceof InvalidInfoException){

            }else{
                console.log("Unexpected error");
            }
        }

    }
}