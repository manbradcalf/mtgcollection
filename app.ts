import { readCSVObjects, writeCSV } from "https://deno.land/x/csv/mod.ts";

const inputCSV = await Deno.open("./helvaultmini.csv");
const outputCSV = await Deno.open("./output.csv", {
  write: true,
  create: true,
  truncate: false,
});

const sleep = (millis: number) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};
const headers = [
  "#",
  "Extra",
  "Language",
  "Name",
  "OracleID",
  "Quantity",
  "ScryfallID",
  "Set Code",
  "Set Name",
  "Price",
];
// Create rows for each card
const rows = [];
rows.push(headers)
for await (const obj of readCSVObjects(inputCSV)) {
  // sleep to be a scyfall good citizen
  sleep(100);
  console.log(`\nCalling Scryfall for ${obj.name}`);

  const res = await fetch(`https://api.scryfall.com/cards/${obj.scryfall_id}`);
  const data = await res.json();
  const card = Object.values(obj);
  const price = data.prices.usd;

  // price is the last column but is empty in the import csv
  // populate price here
  card[card.length - 1] = price;

  // clear out null values as csv writer doesnt handle them
  const cleanedScryfallCard = card.map(function (value) {
    if (value == null) {
      return "";
    } else {
      return value;
    }
  });

  console.log(`\ncard is ${JSON.stringify(cleanedScryfallCard)}`);
  rows.push(cleanedScryfallCard);
}

inputCSV.close();

await writeCSV(outputCSV, rows);
