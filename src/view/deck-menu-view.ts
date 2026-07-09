
import type Deck from "../model/Deck.ts";
import type DeckController from "../controller/deck-controller.ts";

export default class deckMenuView {

    #controller: DeckController;
    #deck: Deck;



    constructor(deck: Deck, controller: DeckController) {
        this.#deck = deck;
        this.#controller = controller;

        document.querySelector("#app")!.innerHTML =
            `<div id="deck-menu">
                <h2 id="deck-title"></h2>
                <!--wrapping the buttons in a class to make it easier to apply CSS on top -->
                <div class="deck-button-row">
                    <button id="add-card">Add Card</button>
                    <button id="delete-card">Delete Card</button>
                    <button id = 'edit-card'>Edit Card</button>
                    <button id="view-cards">View Cards</button>
                    <button id="exit-deck-menu">Back To Menu</button>
                </div>
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