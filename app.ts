import { readCSVObjects, writeCSV } from "https://deno.land/x/csv/mod.ts";

const inputCSV = await Deno.open("./helvaultmini.csv");
const outputCSV = await Deno.open("./example4.csv", {
  write: true,
  create: true,
  truncate: false,
});

// const headers = [
//   "collector_number",
//   "extras",
//   "language",
//   "name",
//   "oracle_id",
//   "quantity",
//   "scryfall_id",
//   "set_code",
//   "set_name",
//   "price",
// ];

const sleep = (millis: number) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

// Create rows for each card
const cards = [];
for await (const obj of readCSVObjects(inputCSV)) {
  // sleep to be a scyfall good citizen
  sleep(100);
  console.log(`\nCalling Scryfall for ${obj.name}`);

  const res = await fetch(`https://api.scryfall.com/cards/${obj.scryfall_id}`);
  const data = await res.json();
  const card = Object.values(obj);
  card.forEach((c) => {
    if (c == null) {
      c == "n/a";
    }
  });
  const price = data.prices.usd;
  card.push(price);
  cards.push(card);
}

console.log(`cards are ${JSON.stringify(cards)}`);

inputCSV.close();

await writeCSV(outputCSV, cards);
