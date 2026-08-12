//This is yet another view that pops up, when user clicks "view cards" in deck menu
import type DeckController from "../controller/deck-controller.ts";
import type Deck from "../model/Deck.ts";
import type FlashCard from "../model/FlashCard.ts";

//Note choosing to not reset the card view to first card if user goes back to deck view

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
        //register as a listener to the deck
        this.#deck.registerListener(this);

        //make the main structure of the view
        this.#rootEl = document.createElement("div");
        this.#rootEl.id = "view-cards";
        this.#rootEl.innerHTML = `
            <div class = "view-header">
                <button id="exit-view-cards">Back To ${this.#deck.name} Deck Menu</button>
                <!--Would be cool to have a progress tracker at the top-->
            </div>
            
            <!--Role = button -> defines container as a clickable button, tell the browser to treat it as a button-->
            <div class = "flashcard" id = "flashcard" tabindex="0" role="button" aria-label="Flashcard, click or press Enter to flip">
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
                        <button id="prev-btn" disabled>Previous Card</button>  <!-- make sure the prev is disable by default-->
                        <button id="next-btn" >Next Card</button>
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

        this.#flipBtn.addEventListener("click", () =>this.#flipCard());

        this.#nextBtn.addEventListener("click", () => this.#showNextCard());
        this.#prevBtn.addEventListener("click", () => this.#showPrevCard());

        //Flip functionality on the card itself
        this.#flashcardEl.addEventListener("click", () => this.#flipCard());


        this.#renderCurrentCard();
    }

    notify(): void {
        this.#cards = this.#deck.cards;

        if (this.#cards.length === 0) {
            //TODO handle empty-deck state - currently controller prevents it
            return;
        }

        if (this.#currIndex > this.#cards.length - 1) {
            this.#currIndex = this.#cards.length - 1;
        }

        this.#renderCurrentCard();
    }


    //Shows the current card
    #renderCurrentCard(): void {
        //TODO handle when user clicks view cards but doesnt have any
        const card = this.#cards.at(this.#currIndex)!;

        // IMPORTANT: textContent, not innerHTML — this is user-supplied data
        //NOT sure if I can do text content on a div element
        this.#frontEl.textContent = card.titleSide;
        this.#backEl.textContent = card.infoSide;

        //now change the visibility of the elements
        this.#flipped = false;
        //make the backside invisible, since its visible by default toggling it make it the opposite
        //Attach the class that will make an element visible
        this.#frontEl.classList.add("visible");
        //this will reset the back to be invisible when we go to the next card
        this.#backEl.classList.remove("visible");

        this.#updateNavButtons();
    }

    //Enables/disables prev and next buttons based on currIndex and cards length.
    #updateNavButtons(): void {
        this.#prevBtn.disabled = this.#currIndex === 0;
        this.#nextBtn.disabled = this.#currIndex === this.#cards.length - 1;
    }

    //"Flips" the card to show the opposite side (Title/Info) and vice versa
    #flipCard(): void {
        this.#flipped = !this.#flipped;
        //toggle removes class "visible" if html element has it, or adds it if the element does have it. this.#flipped acts the condition on whether to apply the toggle at all
        //Attach the class that will make an element visible
        this.#frontEl.classList.toggle("visible", !this.#flipped);
        this.#backEl.classList.toggle("visible", this.#flipped);
    }

    //Shows the next card in the deck
    #showNextCard() : void {
        //only update the value of currIndex if it isnt exceeding the deck size(0 indexed)
        if(this.#currIndex < this.#cards.length-1){
            this.#currIndex++;
            this.#renderCurrentCard();
        }else{
            //Hopefully this never gets hit since the button gets disabled
            console.log("tried to exceed deck size");
        }
    }

    //Shows the previous card in the deck
    #showPrevCard():void{
        //only update the value of currIndex if it isn't smaller than deck size(0 indexed)
        if(this.#currIndex > 0){
            this.#currIndex--;
            this.#renderCurrentCard();
        }else {
            console.log("can't go to a previous card, since we at start of deck");
        }
    }
    //Make the view visible again
    show(): void {
        this.#rootEl.style.display = "";
    }

    //Hide the view without destroying it
    hide(): void {
        this.#rootEl.style.display = "none";
    }

    //Fully tear down this view's DOM
    destroy(): void {
        this.#deck.unregisterListener(this);
        this.#rootEl.remove();
    }




}