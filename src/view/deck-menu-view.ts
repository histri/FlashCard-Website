
import type Deck from "../model/Deck.ts";
import type DeckController from "../controller/deck-controller.ts";
import type FlashCard from "../model/FlashCard.ts";

export default class deckMenuView {

    #controller: DeckController;
    #deck: Deck;
    #cardsEl: HTMLUListElement;


    constructor(deck: Deck, controller: DeckController) {
        this.#deck = deck;
        this.#controller = controller;
        //register the view as a listener to deck doamin instance
        this.#deck.registerListener(this);

        document.querySelector("#app")!.innerHTML =
            `<div id="deck-menu">
                <h2 id="deck-title"></h2>
                <!--wrapping the buttons in a class to make it easier to apply CSS on top -->
                <div class="deck-button-row">
                    <button id="add-card">Add Card</button>
                    <button id="delete-card">Delete Card</button>
                    <button id ="edit-card">Edit Card</button>
                    <button id="view-cards">View Cards</button>
                    <button id="exit-deck-menu">Back To Menu</button>
                </div>
                <!--The main deck view will show previews of the cards the user has added--> 
                <h3>Card Preview</h3>
                <!-- will attach a list here too -->
            </div>`;

        //TODO text abouve the list saying Card Preview
        //create the list imperatively so we hold a direct reference, no re-query needed
        this.#cardsEl = document.createElement("ul");
        document.querySelector("#deck-menu")!.appendChild(this.#cardsEl);

        //IMPORTAnt set title via textContent, not innerHTML because user-supplied
        document.querySelector<HTMLHeadingElement>("#deck-title")!
            .textContent = deck.name;
        //Register the click functionallity on all the immediatly accecible user buttons
        document.querySelector("#add-card")!
            .addEventListener("click", () => this.#controller.showCreateCardView());
        document.querySelector("#delete-card")!
            .addEventListener("click", () => this.#controller.deleteCard());
        document.querySelector("#exit-deck-menu")!
            .addEventListener("click", () => this.#controller.exitDeckMenu());
        document.querySelector("#view-cards")!
            .addEventListener("click", () => this.#controller.viewCards());
        document.querySelector("#edit-card")!
            .addEventListener("click", () => this.#controller.editCards());

        //When Deck will have something persisted we will need to update the view immediately
        //      after initialization
        this.notify();
    }

    //TODO definitely need to make the list/grid of the cards look nicer
    //Listening to changes in deck model instance
    notify():void{
        //clear the list of the cards
        this.#cardsEl.replaceChildren();

        //GO through the deck's cards and give preview of them as a list
        this.#deck.cards.forEach((card: FlashCard) => {
            let cardEl = document.createElement("li");
            cardEl.className = "card";

            const titleEl = document.createElement("h3");
            titleEl.className = "deck-title";
            titleEl.textContent = card.titleSide;        //should be a bit safer?
            //Maybe preview should have the info side also

            cardEl.append(titleEl);
            this.#cardsEl.appendChild(cardEl);
        });

    }
}