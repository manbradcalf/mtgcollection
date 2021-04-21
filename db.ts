// import the package from url
import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";

// Create client
const client = new MongoClient();
const dbString = `mongodb://127.0.0.1:27017/mtg-collection?compressors=disabled&gssapiServiceName=mongodb`;

console.log(`client connecting....using dbString ${dbString}`)

await client.connect(dbString);

console.log(`connected....\n`);

// Defining schema interface
interface Card {
  _id: { $oid: string };
  name: string;
}
// Declare the mongodb collections here. Here we are using only one collection (i.e user).
// Defining schema interface
const db = client.database("mtg-collection");
const cardCollection = db.collection<Card>("cards");

// insert one
const newCardId = await cardCollection.insertOne({name: "new card 2",price: 100})
console.log(`new card id is ${newCardId}`)

// find one
const justOne = await cardCollection.findOne({ _id: newCardId });
console.log(`data is ${JSON.stringify(justOne)}`)

export { cardCollection };
