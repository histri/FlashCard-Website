//This is yet another view that pops up, when user clicks "view cards" in deck menu
import type DeckController from "../controller/deck-controller.ts";
import type Deck from "../model/Deck.ts";
import type FlashCard from "../model/FlashCard.ts";

export default class DisplayCardsView {

    #controller: DeckController;
    #deck: Deck;        //given deck
    #cards: Array<FlashCard>;   //array of flashcards from the given deck

    //variables mapped to HTML elements
    #rootEl: HTMLDivElement;    //the root element of the view
    #flashcardEl: HTMLDivElement;   //the div holding our actual flashcard
    #frontEl: HTMLDivElement;       //front (title) side of the flashcard
    #backEl: HTMLDivElement;        //back (info) side of the flashcard
    #flipBtn: HTMLButtonElement;       //button used to "flip" between front and back side of the flashcard

    //User can label which cards they got right and wrong and use that to review later
    #prevBtn: HTMLButtonElement;
    #nextBtn: HTMLButtonElement;

    //Local vars of the view unrelated to the HTML elements
    #flipped: boolean;      //whether the card has been flipped buy user
    #currIndex: number;     //the current index of the card in the deck, todo remember to check for bounds of deck regarding this

    constructor(deck:Deck, controller: DeckController) {
        this.#controller = controller;
        this.#deck = deck;
        this.#cards = deck.cards;
        this.#currIndex = 0;
        this.#flipped = false;
        //Note I don't think I need to register this view as a listener to the deck instance

        //make the main structure of the view
        this.#rootEl = document.createElement("div");
        this.#rootEl.id = "view-cards";
        this.#rootEl.innerHTML = `
        <div id = "view-cards">
            <div class = "view-header">
                <button id="exit-view-cards">Back To Menu</button>
                <!--Would be cool to have a progress tracker at the top-->
            </div>
            
            <div class = "flashcard" id = "flashcard">
                <div class="flashcard-inner">
                        <!-- class for CSS, id for queorying the element for a variable -->
                        <div class="flashcard-face front" id="card-front"></div>
                        <div class="flashcard-face back" id="card-back"></div>
                    </div>
            </div>
            
            <div class = "view-controlls">
                <button id="flip-btn">Flip Card</button>
                    <div class="answer-buttons">
                        <!-- TODO definitely want a wrong correct buttons-->
                        <!--TODO maybe disable the buttons before the user sees the other side? -->
                        <button id="prev-btn" disabled >Previous Card</button>
                        <button id="next-btn" >Next Card</button>
                    </div>
            </div> 
        </div>
        `
        document.querySelector("#app")!.appendChild(this.#rootEl);
        //Better programming practice to query the root element of current view,
        //      and then to query again that element, this way lower risk of it matching something outside the current view

        this.#flashcardEl = this.#rootEl.querySelector("#flashcard")!;
        this.#frontEl = this.#rootEl.querySelector("#card-front")!;
        this.#backEl = this.#rootEl.querySelector("#card-back")!;
        this.#flipBtn = this.#rootEl.querySelector("#flip-btn")!;
        this.#prevBtn = this.#rootEl.querySelector("#prev-btn")!;
        this.#nextBtn = this.#rootEl.querySelector("#next-btn")!;

        this.#rootEl.querySelector("#exit-view-cards")!
            .addEventListener("click", () => this.#controller.exitViewCards());

        //TODO work on the functionality of flipping the button
        //this.#flipBtn.addEventListener("click", () =>);


        this.#renderCurrentCard();
    }

    #renderCurrentCard(): void {
        //TODO handle when user clicks view cards but doesnt have any
        const card = this.#cards.at(this.#currIndex)!;

        // IMPORTANT: textContent, not innerHTML — this is user-supplied data
        //NOT sure if I can do text content on a div element
        this.#frontEl.textContent = card.titleSide;
        this.#backEl.textContent = card.infoSide;
    }

    //Make the view visible again
    show(): void {
        this.#rootEl.style.display = "";
    }

    //Hide the view without destroying it
    hide(): void {
        this.#rootEl.style.display = "none";
    }

    //Fully tear down this view's DOM. This view doesn't register itself as a
    //Deck listener, so there's no unregister step needed
    destroy(): void {
        this.#rootEl.remove();
    }




}