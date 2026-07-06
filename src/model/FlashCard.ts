export default class FlashCard {
    //Main functionality for the application
    //Each flash card has a title and info side the user studies by
    //      trying to recollect info about a specific title
    //      (ex title - Labrador Retriever, info side - The Labrador Retriever, also known simply as the Labrador or Lab, is a British breed of retriever gun dog)
    //      https://en.wikipedia.org/wiki/Labrador_Retriever
    // The user can input the title and info, flip the card
    //TODO possible future functionality - draw input,


    #id: number;
    #title: string;             //front side of the card
    #backDescript: string;      //back side of the card that gets revealed later


    constructor(title:string, backDescript:string) {
        //ID will be initialised from database (not set up yet)
        this.#title = title;
        this.#backDescript = backDescript;

    }

    checkCard() :void{
        //Invariants
    }

}