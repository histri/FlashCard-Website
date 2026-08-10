import Deck from "./Deck.ts";
import type Listener from "./Listener.ts";
import {supabase} from "../supabaseClient.ts";
import {UserExistsException} from "./exceptions.ts";
//Main Domain class in the current hierarchy NoteBook > Deck > Cards


//TODO the builds should really have a try catch, to avoid null ids



export  default class NoteBook {
    #id?: number;               //id of the instance (assigned by database)
    #name : string;
    //#id: number;                //current not used, could be used in case of multiple accounts
    #decks: Array<Deck>;        //array of card decks that the notebook has
   // #numOfDecks: number;      //just size of the deck array
    #listeners: Array<Listener>;    //listeners listen to the updates on this domain class

    private constructor(name: string, idExists?: number, deckExists?: Array<Deck>) {
        //deck will always have a name given as a parameter
        this.#name = name;
        //if the user wasn't defined
        if(idExists === undefined) {
            this.#decks = new Array<Deck>();
            this.#listeners = new Array<Listener>();
            //check assertions
            this.#checkNoteBook();
        }else{
            //a user with given info already exists
            //Adding '!' since we know this will be assinged to object
            this.#id = idExists!;
            this.#decks = deckExists!;
            this.#listeners =  new Array<Listener>();
            this.#checkNoteBook();
        }

    }

    //create() - given a username, create a new instance of Notebook class (user)
    //      username - name that the user is created with - must be unique
    public static async create(username: string): Promise<NoteBook> {
        //check whether a given user exists
        const exists: boolean = await this.#noteExists(username);
        //if user exists throw an exception to stop the function
        if (exists) {
            throw new UserExistsException(username);
        }

        const noteBook = new NoteBook(username);
        await NoteBook.saveNote(noteBook);
        return noteBook;
    }

    //Load an existing notebook. Fails if no account exists with this username -
    //  this is the "Log In" flow.
    public static async login(username: string): Promise<NoteBook> {
        let n: NoteBook;
        //check whether a user with the given name exists
        const exists: boolean = await this.#noteExists(username);
        if (!exists) {
          throw new UserExistsException(username);
        }

        //fetch data from the database and create an instance based on that
        n = await NoteBook.load(username);
        return n;
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
            n.#id = response.data[0].user_id;
        }


        //TODO what if notebook/deck/card got edited?

        //TODO need to pass id of the object to make the foreign key constraint work

        // Cascade: save each deck that belongs to this notebook, the same way
        n.decks.forEach((deck : Deck) => {

            // only decks that haven't been saved yet
            // should get inserted here, otherwise if there is a change in the deck, the deck itself will handle it

            if(deck.id === undefined) {
                Deck.saveDeck(deck, n.#id!);
            }

        });
    }

    //noteExists() - Check whether a user with a given name already exists
    static async #noteExists(name:string): Promise<boolean>{
        let found : boolean = false;

        //2 options
        //SELECT * FROM profiles WHERE username = 'Andrii Notebook';

        //SELECT user_id FROM profiles WHERE username = 'Andrii Notebook'; -> this is faster

        const {data, error} = await supabase
            .from('profiles')
            .select('user_id')
            .eq('username', name);


        if (error || data === undefined || data === null) {
            //no if DB gives error or undefined data
            found = false;
        }else if (data.length> 0){
            //yes only if the data we get actually holds something
            found = true;
        }
        return found;
    }


    //Template for checking if notebook/user exist
    /*     static async userExists(name: string): Promise<void> {
        const result = await db().query(
            "SELECT 1 FROM dog WHERE username = $1", [name]
        );
        if (result.rows.length > 0) {
            throw new DuplicateUserException();
        }
    }*/
    //TODO I should really rename notebook to user makes it very confusing currently

    static async load(name: string) : Promise<NoteBook> {
        //We know the notebook exists now we just need to create the new
        let noteBook: NoteBook;

        const {data, error} = await supabase
        .from('profiles')
        .select('user_id')
        .eq('username', name);

        if(error) {
            console.error('Error loading notebook:', error);
        }

        if (!data || data.length === 0) {
            console.error('Error loading notebook:', error);
        }


        // @ts-ignore                   - for now
        const id: number = data[0].user_id;

        // Cascade: load this notebook's decks (which should themselves cascade to load their cards)
        const decks: Array<Deck> = await Deck.loadDecksForNoteBook(id);

        // Listeners are runtime-only, never persisted — always start empty on load


        noteBook = new NoteBook(name, id,  decks);

        return noteBook;

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