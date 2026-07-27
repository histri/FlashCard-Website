-- TODO No data sources are configured to run this SQL and provide advanced code assistance

--Notebook table


--Deck table


--Flashcard table


--TODO make sure to implement rules, ex: Row level security to the program

create table if not exists FlashCard(
    id serial not null unique,
    title varchar(255) not null unique,
    info varchar(255) not null unique,
    -- TODO add a tie back to the owning class (EX: deckName -> deck that owns the card

    --TODO add a foreign key constraint on the owning class - When deck is deleted the card is also deleted
    foreign key(owner) references Dog(userName)
    on delete cascade
    );
