//Currently implementing a very basic log in to the application (no auth or security)

import NotebookController from "../controller/notebook-controller.ts";

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
              <input type="text" id="nickname" />
             <!-- <label for="Password">Password</label> -->
             <!-- <input type="text" id="Password" /> -->
              <button>Add Account</button>
        `;
        this.#logInDialog.innerHTML = `
           <span id="error"></span><br />
          <label for="nickname">Name</label>
          <input type="text" id="nickname" />
         <!--  <label for="Password">Password</label> -->
          <!-- <input type="text" id="Password" /> -->
          <button>Enter </button>
        `

        // only open the relevant dialog when chosen
        this.#choiceDiv.querySelector("#showCreate")!
            .addEventListener("click", () => {
                this.#logInDialog.close();
                this.#createAccountDialog.show();
            });

        this.#choiceDiv.querySelector("#showLogin")!
            .addEventListener("click", () => {
                this.#createAccountDialog.close();
                this.#logInDialog.show();
            });
        this.#createAccountDialog.querySelector("button")!
            .addEventListener("click", () => this.#addUser());
        // add to the page:

        this.#logInDialog.querySelector("button")!
            .addEventListener("click", () => this.#logInUser());

        this.#root.append(this.#choiceDiv, this.#createAccountDialog, this.#logInDialog);
        document.querySelector("#app")!.appendChild(this.#root);
    }


    async #addUser() : Promise<void> {
        let name = this.#createAccountDialog.querySelector<HTMLInputElement>("#nickname")!.value.trim();

        try{
            await this.#controller.createUser(name);
            //success - the controller swaps this whole view out, but tidy up just in case
            this.#createAccountDialog.close();
        }catch(e: any){

        }
    }

    async #logInUser() : Promise<void> {
        let name = this.#logInDialog.querySelector<HTMLInputElement>("#nickname")!.value.trim();
        try{
            await this.#controller.logInUser(name);
            this.#logInDialog.close();
        }catch(e: any){

        }
    }


    //TODO so is this view still ther as the user uses the app?
    hide(): void {
        this.#root.style.display = "none";
    }
}
