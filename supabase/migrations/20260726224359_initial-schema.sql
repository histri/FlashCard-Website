-- TODO No data sources are configured to run this SQL and provide advanced code assistance
--TODO dont forget transactions

--Notebook table
create table if not exists profiles(
    --For now no auth it will probably be in this table
    user_id SERIAL PRIMARY KEY,                 --no need to specify unique on primary keys, they are always unique
    username VARCHAR (50) UNIQUE NOT NULL,
    created_at timestamptz not null default now()           --timestamp for when a user was added
);

--Deck table
create table if not exists decks(
    id serial PRIMARY KEY,
    deck_name varchar(255) not null,  --I dont think the actual code enforces that decks have unique names yet
    --very import to specify not null for mandatory relationships since otherwise the DB would let us create an orphan by default
    owner_user_id integer not null references  profiles(user_id) on delete cascade,

    --This is different from just making deck_name unique -> all users must have unique decks, instead this means a given
        --user cant have 2 decks with the same name
    unique(owner_user_id, deck_name)
);

--Flashcard table
--TODO make sure to implement rules, ex: Row level security to the program
--ROW LEVEL SECURITY IS VERY IMPORTANT anyone can access any data they want right now

create table if not exists flashcards(
    id serial PRIMARY KEY,
    title varchar(255) not null,            --not having unique here because that would enforce unique in the whole database not just the deck
    info text not null ,                    --text instead of varchar() text is built for large unstructured user inputs
    -- foreign key constraint on the owning class - When deck is deleted the card is also deleted
    deck_id INTEGER not null references decks(id) on delete cascade,
    unique(deck_id, title)                  --each given deck should have unique cards, (but not all decks as whole)
 );


/*
example of a create table https://neon.com/postgresql/tutorial/create-table

CREATE TABLE accounts (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  email VARCHAR (255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);
 */

 --https://wiki.postgresql.org/wiki/Don't_Do_This#Don't_use_timestamp_(without_time_zone)
