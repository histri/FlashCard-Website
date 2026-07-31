import Deck from "./Deck.ts";
import type Listener from "./Listener.ts";
import {supabase} from "../supabaseClient.ts";
//Main Domain class in the current hierarchy NoteBook > Deck > Cards


//TODO the builds should really have a try catch, to avoid null ids

export  default class NoteBook {
    #id?: number;               //id of the instance (assigned by database)
    #name : string;
    //#id: number;                //current not used, could be used in case of multiple accounts
    #decks: Array<Deck>;        //array of card decks that the notebook has
   // #numOfDecks: number;      //just size of the deck array
    #listeners: Array<Listener>;    //listeners listen to the updates on this domain class


    private constructor() {
        this.#name = "Default name";
        this.#decks = new Array<Deck>();
        this.#listeners = new Array<Listener>();
        //check assertions
        this.#checkNoteBook()
    }

    //For making a brand new deck
    public static async build (): Promise<NoteBook>{
        const noteBook: NoteBook = new NoteBook();

        //save the build immediately
        await NoteBook.saveNote(noteBook);

        return noteBook;

    }


    //TODO make more specific listeners the notify here should probably only apply to notebook view
    //Notifies all the listeners
    #notifyAll() {
        this.#listeners.forEach((l) => l.notify());
        //TODO it would be a good idea to save the info to database on each notify
    }

    //register other code that can listen to it
    registerListener(listener: Listener) {
        this.#listeners.push(listener);
        //check invariants
        this.#checkNoteBook();
    }

    //Check domain class invariants
    #checkNoteBook(): void{
        //Invariants
        //currently aren't any
    }

    //Let user add a new deck to their notebook
    //TODO maybe make it return a boolean for success
    addDeck(deck: Deck): void {
        this.#decks.push(deck);
        NoteBook.saveNote(this);
        //notify the listeners that the domain class has changed
        this.#notifyAll();
    }

    // deleteDeck(deck: Deck): void {
    //     //TODO implement
    // }

    /*
            GETTERS
    */

    get decks(): Array<Deck> {
        return this.#decks;
    }

    get id() : number|undefined {
        return this.#id;
    }

    /*
    DB
    */

    //saves the user state
    static async saveNote(n : NoteBook): Promise<void> {
        //if this is the first time creating the notebook it need an id assigned to it
        //      otherwise for now we only care about saving the decks to it
        if(n.#id === undefined){
            //TODO how to make parametized queries
            const response = await supabase
                .from('profiles') //table name
                .insert([
                    {
                        username: n.#name,
                    }
                ])
                .select();
            // Access properties directly off the response object
            if (response.error) {
                console.error('Error saving notebook:', response.error);
                return;
            }
            console.log('Notebook saved successfully:', response.data);
            n.#id = response.data[0].id;
        }


        //TODO what if notebook/deck/card got edited?

        //TODO need to pass id of the object to make the foreign key constraint work

        // Cascade: save each deck that belongs to this notebook, the same way
        n.decks.forEach((deck : Deck) => {

            // only decks that haven't been saved yet
            // should get inserted here, other wise if there is a change in the deck, the deck itself will handle it

            if(deck.id === undefined) {
                Deck.saveDeck(deck, n.#id!);
            }

        });
    }


    //Constructors can't be async, however i need to use async to query the database, this makes a problem since I need to assign an id
    //  to class instance immediately before they are used in any way, I struggled with this in Comp2452 and found some ridiculous work around
    //  this time I am trying to use a best practice, so will use a builder (like Comp 2450)

    //https://medium.com/better-programming/how-to-write-an-async-class-constructor-in-typescript-javascript-7d7e8325c35e

    /* Will look something like

    class MyClass {
      private constructor() {           <- typescript allows private constructors
        // set props normally
        // nothing async can go here
      }
      public static async build(): Promise<MyClass> {
        // do your async stuff here
        // now instantiate and return a class
        return new MyClass()
      }
    }

      //somewhere else
      const myClassInstance = await MyClass.build()



     */



}