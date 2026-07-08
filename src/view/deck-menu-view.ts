import type NotebookController from "../controller/notebook-controller.ts";
import type Deck from "../model/Deck.ts";
import type DeckController from "../controller/deck-controller.ts";

export default class deckMenuView {

    //TODO should I split a new controller for responsibilities??
    //For now choosing to not do that
    #controller: DeckController;
    #deck: Deck;



    constructor(deck: Deck, controller: DeckController) {
        this.#deck = deck;
        this.#controller = controller;

        document.querySelector("#app")!.innerHTML =
            `<div id="deck-menu">
                <h2 id="deck-title"></h2>
                <button id="add-card">Add Card</button>
                <button id="delete-card">Delete Card</button>
                <button id="exit-deck-menu">Back</button>
                <button id="view-cards">View Cards</button>
            </div>`;

        //IMPORTAnt set title via textContent, not innerHTML because user-supplied
        document.querySelector<HTMLHeadingElement>("#deck-title")!
            .textContent = deck.name;

        document.querySelector("#add-card")!
            .addEventListener("click", () => this.#controller.addToDeck());
        document.querySelector("#delete-card")!
            .addEventListener("click", () => this.#controller.deleteCard());
        document.querySelector("#exit-deck-menu")!
            .addEventListener("click", () => this.#controller.exitDeckMenu());
        document.querySelector("#view-cards")!
            .addEventListener("click", () => this.#controller.viewCards());

    }
}