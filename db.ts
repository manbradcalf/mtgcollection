import { Client } from "https://deno.land/x/mysql/mod.ts";
import { ScryfallCard } from "./ScryfallCard.ts";
const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "mtgcollection",
  password: "9001055",
});

async function makeTable() {
  await client.execute(`CREATE DATABASE IF NOT EXISTS mtgcollection`);
  await client.execute(`USE mtgcollection`);
  await client.execute(`
                       CREATE TABLE cards (
                        collector_number varchar(100) NOT NULL,
                        extras varchar(100) NOT NULL,
                        language varchar(100) NOT NULL,
                        name varchar(100) NOT NULL,
                        oracle_id varchar(100) NOT NULL,
                        quantity int NOT NULL,
                        scryfall_id varchar(100) NOT NULL,
                        set_code varchar(10) NOT NULL,
                        set_name varchar(100) NOT NULL,
                        price decimal NOT NULL
                       ) ENGINE=CSV CHARSET=utf8`);
}

async function insertCard(card: ScryfallCard) {
  await client.execute(
    `INSERT INTO cards (collector_number,extras,language,name,oracle_id,quantity,scryfall_id,set_code,set_name,price) VALUES(${card.collectorNumber},${card.extras},${card.language},${card.name},${card.oracle_id},${card.quantity},${card.scryfallUri},${card.setType},${card.setName},${card.prices.usd})`
  );
}

export { client, makeTable };
