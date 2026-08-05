---
Flows of interaction for FlashCard Application
===
Andrii Vdovyniuk
---
date: Aug 5 2026
---
Currently some of the features aren't fully implemented or working on being implemented
TODO start screen with a log in

```mermaid
flowchart
    subgraph Account Screen
        mainScreen[[Start Screen]]
        
        
        
        createAccountDialog[Create Account]
        processCreate{Process Create Account info}

        LogInDialog[Login]
        processLogIn{Process Login info}
        
        
        
        mainScreen == (click) createAccount ==> createAccountDialog
        mainScreen == (click) Log in ==> LogInDialog
        
        
        createAccountDialog == Username  & Password ==> processCreate
        processCreate -. Invalid Account Info .-> createAccountDialog
        processCreate -. Create the account (log in with it) .-> NotebookScreen
        
        LogInDialog == Username & Password ==> processLogIn
        processLogIn -. Invalid Account info .-> LogInDialog
        processLogIn -. Selected Account .-> NotebookScreen
        
      
    end
    
    
```
```mermaid
flowchart
    subgraph Notebook Screen
        mainScreen[[Logged in Screen]]
        
        createDeckScreen[Add Deck]
        processCreate{Process Add Deck info}
        
        selectDeck[Select Deck]
        DeckScreen[Selected Deck Screen]
        
        
        mainScreen == (click) Add Deck ==> createDeckScreen
        mainScreen == (click) Select Deck ==> selectDeck
        
        createDeckScreen == Deck Name ==> processCreate
        processCreate -. Invalid Deck Info .-> createDeckScreen
        processCreate -. Create the Deck (add it to the screen) .-> mainScreen
        
        selectDeck -. Invalid Deck Selected / MissClick .-> mainScreen
        selectDeck -. Selected Deck .-> DeckScreen
        
      
    end
    
    
```