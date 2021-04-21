// import the package from url
import { MongoClient, Bson } from "https://deno.land/x/mongo@v0.22.0/mod.ts";
// import { Card } from "./ScryfallCard.ts";
const mongoUser = "Deno"
const mongoPass = "Deno"
const mongoHost = "localhost"
const mongoPort = "27017"
const dbName = "mtg-collection"

const dbString = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${dbName}`;

// Create client
const client = new MongoClient();
console.log(`client is ${JSON.stringify(client)}\n`)
console.log(`client connecting....using dbString ${dbString}`)
await client.connect(dbString);
console.log(`connected....?`);
// await client.connect({
//   db: "mtg-collection",
//   tls: true,
//   servers: [
//     {
//       host: "mongodb://localhost",
//       port: 27017,
//     },
//   ],
//   credential: {
//     username: "Deno",
//     password: "Deno",
//     db: "mtg-collection",
//     mechanism: "SCRAM-SHA-1",
//   },
// });

// Defining schema interface
interface Card {
  _id: { $oid: string };
  name: string;
}
// Declare the mongodb collections here. Here we are using only one collection (i.e user).
// Defining schema interface
// const db = client.database("mtg-collection");
// const cardCollection = db.collection<Card>("cards");
// const justOne = await cardCollection.findOne({ _id: "607cf80a05a906bf2d2ec433" });
// console.log(`data is ${justOne}`)
// export { db, cardCollection };
