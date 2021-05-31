// import the package from url
import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
import { Card } from "./ScryfallCard.ts";

// Create client
const client = new MongoClient();
const dbString = `mongodb://127.0.0.1:27017/mtg-collection?compressors=disabled&gssapiServiceName=mongodb`;
console.log(`client connecting....using dbString ${dbString}`);

await client.connect(dbString);

console.log(`connected....\n`);

// Declare the mongodb collections here. Here we are using only one collection (i.e user).
// Defining schema interface
const db = client.database("mtg-collection");
const cardCollection = db.collection<Card>("cardstwo");

export { cardCollection };
