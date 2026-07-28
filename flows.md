---
Flows of interaction for FlashCard Application
===
Andrii Vdovyniuk
---
date: July 28 2026
---
Currently some of the features aren't fully implemented or working on being implemented
TODO start screen with a log in

```mermaid
flowchart
    subgraph Start Screen
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