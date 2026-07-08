//Might not be necessary if I am just looking at cards through the deck view
import type NotebookController from "../controller/notebook-controller.ts";

export default class createCardView {
    //TODO should really split the responsability of notebook and deck controller not sure how in MVC since they both could
    // affect each other
    #controller: NotebookController;
    #dialog: HTMLDialogElement;

    constructor(controller: NotebookController) {
        this.#controller = controller;
        this.#dialog = new HTMLDialogElement();
        //add the dialog details

    }

    #addCard(): void {

    }


}