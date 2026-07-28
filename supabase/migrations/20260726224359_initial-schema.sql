-- TODO No data sources are configured to run this SQL and provide advanced code assistance

--Notebook table
create table if not exists Notebook(
   --all the auth related stuff would probably go there
);

--Deck table
create table if not exists Deck(
    id serial not null unique,
    name varchar(255) not null unique,  --I dont think the actual code enforces that decks have unique names yet

);

--Flashcard table
--TODO make sure to implement rules, ex: Row level security to the program

create table if not exists FlashCard(
    id serial not null unique,
    title varchar(255) not null unique,
    info varchar(255) not null unique,
    owner varchar(255) not null,            --references the deck that owns the card


    -- foreign key constraint on the owning class - When deck is deleted the card is also deleted
    --TODO maybe have it as id?
    foreign key(owner) references Deck(name)
    on delete cascade
 );
