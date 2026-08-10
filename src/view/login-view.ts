//Currently implementing a very basic log in to the application (no auth or security)

import NotebookController from "../controller/notebook-controller.ts";
import {UserExistsException} from "../model/exceptions.ts";

export default class LoginView{
    #controller: NotebookController;
    #createAccountDialog: HTMLDialogElement;
    #logInDialog: HTMLDialogElement;
    #choiceDiv: HTMLDivElement;
    #root: HTMLDivElement;


    constructor(controller: NotebookController){
        this.#controller = controller;

        this.#root = document.createElement("div");

        // choice screen
        this.#choiceDiv = document.createElement("div");
        this.#choiceDiv.innerHTML = `
            <h2>Welcome</h2>
            <button id="showCreate">Create Account</button>
            <button id="showLogin">Log In</button>
        `;

        this.#createAccountDialog = document.createElement("dialog");
        this.#logInDialog = document.createElement("dialog");
        this.#createAccountDialog.innerHTML = `
              <h2>Create Account</h2>
              <span id="error"></span><br />
              <label for="nickname">Name</label>
              <input type="text" id="nickname"/>
             <!-- <label for="Password">Password</label> -->
             <!-- <input type="text" id="Password" /> -->
              <button>Add Account</button>
              <button id = "closeBtn">Close</button>
        `;

        this.#logInDialog.innerHTML = `
            <h2>Log into an Account</h2>
           <span id="error"></span><br />
          <label for="nickname">Name</label>
          <input type="text" id="nickname" />
         <!--  <label for="Password">Password</label> -->
          <!-- <input type="text" id="Password" /> -->
          <button>Enter</button>
          <button id = "closeBtn">Close</button>
        `

        // only open the relevant dialog when chosen
        this.#choiceDiv.querySelector("#showCreate")!
            .addEventListener("click", () => {
                this.#logInDialog.close();
                this.#createAccountDialog.showModal();
            });


        this.#choiceDiv.querySelector("#showLogin")!
            .addEventListener("click", () => {
                this.#createAccountDialog.close();
                this.#logInDialog.showModal();
            });

        //Close the dialogs
        this.#createAccountDialog.querySelector("#closeBtn")!
            .addEventListener("click", () => {
                this.#createAccountDialog.close();
                //remove the text the user might have entered before clicking close
                this.#createAccountDialog.querySelector<HTMLInputElement>("#nickname")!.value = "";
            });

        this.#logInDialog.querySelector("#closeBtn")!
            .addEventListener("click", () => {
                this.#logInDialog.close();
                //remove the text the user might have entered before clicking close
                this.#logInDialog.querySelector<HTMLInputElement>("#nickname")!.value = "";
            });

        //Tie functionality to user dialog
        this.#createAccountDialog.querySelector("button")!
            .addEventListener("click", () => this.#addUser());
        // add to the page:

        this.#logInDialog.querySelector("button")!
            .addEventListener("click", () => this.#logInUser());

        //Pressing enter when typing in dialog does the same thing as clicking the create/log in button
        this.#createAccountDialog.querySelector<HTMLInputElement>("#nickname")!.
        addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                this.#addUser();
            }
        });

        this.#logInDialog.querySelector<HTMLInputElement>("#nickname")!.
        addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                this.#logInUser();
            }
        });

        this.#root.append(this.#choiceDiv, this.#createAccountDialog, this.#logInDialog);
        document.querySelector("#app")!.appendChild(this.#root);
    }


    async #addUser() : Promise<void> {
        let name = this.#createAccountDialog.querySelector<HTMLInputElement>("#nickname")!.value.trim();

        try{
            await this.#controller.createUser(name);
            //close the dialog before controller closes the screen and opens a notebook
            this.#createAccountDialog.close();
        }catch(e: any){
            if(e instanceof UserExistsException){
                this.#createAccountDialog.querySelector<HTMLInputElement>("#nickname")!
                    .setAttribute("style", "border-color:red;");
                this.#createAccountDialog.querySelector("#error")!
                    .textContent = "Invalid name, an account with \"" + name + "\" already exists";
            }else{
                console.log("Some unknown error on create account");
            }


        }
    }

    async #logInUser() : Promise<void> {
        let name = this.#logInDialog.querySelector<HTMLInputElement>("#nickname")!.value.trim();
        try{
            //TODO issues with it, is it because async?
            console.log("Started tryiing to log in");
            await this.#controller.logInUser(name);
            console.log("should be logged in now");
            this.#logInDialog.close();
        }catch(e: any){
            if(e instanceof UserExistsException){
                this.#logInDialog.querySelector<HTMLInputElement>("#nickname")!
                    .setAttribute("style", "border-color:red;");
                this.#logInDialog.querySelector("#error")!
                    .textContent = "Invalid name, an account with \"" + name + "\" doesn't exist";
            }else{
                console.log("Some unknown error on log in");
            }
        }
    }


    //TODO so is this view still there as the user uses the app?
    hide(): void {
        this.#root.style.display = "none";
    }
}
