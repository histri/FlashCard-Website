
import type Deck from "../model/Deck.ts";
import type DeckController from "../controller/deck-controller.ts";
import type FlashCard from "../model/FlashCard.ts";

export default class deckMenuView {

    #controller: DeckController;
    #deck: Deck;
    #cardsEl: HTMLUListElement;
    #rootEl: HTMLDivElement;   //this view's own root, so it can live alongside other views in #app


    constructor(deck: Deck, controller: DeckController) {
        this.#deck = deck;
        this.#controller = controller;
        //register the view as a listener to deck doamin instance
        this.#deck.registerListener(this);

        this.#rootEl = document.createElement("div");
        this.#rootEl.id = "deck-menu";
        this.#rootEl.innerHTML =
            `    <h2 id="deck-title"></h2>
                <!--wrapping the buttons in a class to make it easier to apply CSS on top -->
                <div class="deck-button-row">
                    <button id="add-card">Add Card</button>
                    <button id="delete-card">Delete Card</button>
                    <button id ="edit-card">Edit Card</button>
                    <button id="view-cards">View Cards</button>
                    <button id="exit-deck-menu">Back To Main Menu</button>
                </div>
                <!--The main deck view will show previews of the cards the user has added--> 
                <h3>Card Preview</h3>
                <!-- will attach a list here too -->
            </div>`;

        document.querySelector("#app")!.appendChild(this.#rootEl);

        //create the list imperatively so we hold a direct reference, no re-query needed
        this.#cardsEl = document.createElement("ul");
        this.#rootEl.appendChild(this.#cardsEl);

        //IMPORTAnt set title via textContent, not innerHTML because user-supplied
        this.#rootEl.querySelector<HTMLHeadingElement>("#deck-title")!
            .textContent = deck.name;
        //Register the click functionallity on all the immediatly accecible user buttons
        this.#rootEl.querySelector("#add-card")!
            .addEventListener("click", () => this.#controller.showCreateCardView());
        this.#rootEl.querySelector("#delete-card")!
            .addEventListener("click", () => this.#controller.showDeleteCardView());
        this.#rootEl.querySelector("#exit-deck-menu")!
            .addEventListener("click", () => this.#controller.exitDeckMenu());
        this.#rootEl.querySelector("#view-cards")!
            .addEventListener("click", () => this.#controller.viewCards());
        this.#rootEl.querySelector("#edit-card")!
            .addEventListener("click", () => this.#controller.showEditCardView());

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
    ///
    ///<style> - html shortcut to get CSS applied to elements
    ///

    //Make the view visible again. Use this for back forth navigation in deck menu
    show(): void {
        this.#rootEl.style.display = "";
    }

    //Hide the view without destroying it or unregistering the listener.
    hide(): void {
        this.#rootEl.style.display = "none";
    }

    //Fully tear down this view: unregister from the deck so it stops being
    //notified, and remove its DOM. Call this ONLY when the view is being
    //discarded for good (not just navigated away from temporarily) - e.g. if
    //the user leaves this deck entirely for a different one.
    destroy(): void {
        this.#deck.unregisterListener(this);
        this.#rootEl.remove();
    }
}