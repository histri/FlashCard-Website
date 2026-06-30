export default class FlashCard {

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