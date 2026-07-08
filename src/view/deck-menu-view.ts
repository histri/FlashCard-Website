import type NotebookController from "../controller/notebook-controller.ts";
import type Deck from "../model/Deck.ts";

export default class deckMenuView {

    //TODO should I split a new controller for responsibilities??
    //For now choosing to not do that
    #controller: NotebookController;
    #deck: Deck;
    #title: HTMLHeadingElement;
    #addCardButton: HTMLButtonElement;          //clicking the button should open the dialog for details of the flashcard
    #deleteCardButton: HTMLButtonElement;       //clicking the buttong should open dialog for which specific card to delete

    constructor(deck: Deck, controller: NotebookController) {
        this.#deck = deck;
        this.#controller = controller;

        this.#title = document.createElement("h2");
        //I think using text.Content is more secure against XSS attacks, but I am not sure
        this.#title.textContent = deck.name;

        this.#addCardButton = document.createElement("button");
        this.#addCardButton.addEventListener("click", () => {this.#controller.addToDeck();});

    }
}