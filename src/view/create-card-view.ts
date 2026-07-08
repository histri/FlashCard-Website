//Might not be necessary if I am just looking at cards through the deck view
import type DeckController from "../controller/deck-controller.ts";

export default class createCardView {
    //TODO should really split the responsability of notebook and deck controller not sure how in MVC since they both could
    // affect each other
    #controller: DeckController;
    #dialog: HTMLDialogElement;
    #tempP: HTMLParagraphElement;

    constructor(controller: DeckController) {
        this.#controller = controller;
        this.#dialog = new HTMLDialogElement();
        //add the dialog details
        this.#tempP = new HTMLParagraphElement();
        this.#tempP.textContent = "Create a new card view";
    }

    #addCard(): void {

    }


}