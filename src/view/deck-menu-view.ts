import type NotebookController from "../controller/notebook-controller.ts";
import type Deck from "../model/Deck.ts";

export default class deckMenuView {

    //TODO should I split a new controller for responsibilities??
    //For now choosing to not do that
    #controller: NotebookController;
    #deck: Deck;
    #title: HTMLHeadingElement;
    constructor(deck: Deck, controller: NotebookController) {
        this.#deck = deck;
        this.#controller = controller;
    }
}