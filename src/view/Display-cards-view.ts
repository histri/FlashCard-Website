//This is yet another view that pops up, when user clicks "view cards" in deck menu
import type DeckController from "../controller/deck-controller.ts";
import type Deck from "../model/Deck.ts";

export default class DisplayCardsView {

    #controller: DeckController;
    #deck: Deck;

    constructor(deck:Deck, controller: DeckController) {
        this.#controller = controller;
        this.#deck = deck;

        //Note I don't think I need to register this view as a listener to the deck instance

        //make the main structure of the view
        document.querySelector("#app")!.innerHTML = `
        <div id = "view-cards">
            <div class = "view-header">
            
            </div>
            
            <div class = "flashcard"
                <div class="flashcard-inner">
                        <div class="flashcard-face front" id="card-front"></div>
                        <div class="flashcard-face back" id="card-back"></div>
                    </div>
            </div>
            
            <div class = "view-controlls"
                <button id="flip-btn">Flip Card</button>
                    <div class="answer-buttons">
                        <!--TODO maybe disable the buttons before the user sees the other side? -->
                        <button id="wrong-btn" >Wrong</button>
                        <button id="correct-btn" >Correct</button>
                    </div>
            </div> 
        </div>
        `


    }
}