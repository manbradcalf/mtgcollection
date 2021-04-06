import { readCSVObjects, writeCSV } from "https://deno.land/x/csv/mod.ts";

const inputCSV = await Deno.open("./helvault.csv");
const outputCSV = await Deno.open("./output.csv", {
  write: true,
  create: true,
  truncate: false,
});

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
  const price = data.prices.usd;

  // price is the last column but is empty in the import csv
  // populate price here
  card[card.length - 1] = price;

  // clear out null values as csv writer doesnt handle them
  const cleanedCard = card.map(function (value) {
    if (value == null) {
      return "na";
    } else {
      return value;
    }
  });

  console.log(`\ncard is ${JSON.stringify(cleanedCard)}`);
  cards.push(cleanedCard);
}

inputCSV.close();

await writeCSV(outputCSV, cards);
