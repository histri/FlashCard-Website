//This is a controller for the features realted to the notebook - making new courses deleting, managing the accoutn

import NoteBook from "../model/NoteBook.ts";
import NoteView from "../view/notebook-view.ts";

export default class NotebookController {

    #notebook: NoteBook;
    #notebokView: NoteView;
    constructor() {
        this.#notebook = new NoteBook();

    }
}