import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";
import { cardCollection } from "../db.ts";
import {
  ScryfallCard,
  MongoCard,
  HistoricalPrices,
  Prices,
} from "../types/ScryfallCard.ts";

const sleep = (millis: number) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

async function mapCSVtoCards(csvPath: string): Promise<ScryfallCard[]> {
  console.log(`calling map function, csvPath is ${csvPath}`);
  const csv = await Deno.open(csvPath);

  console.log(`the csv is ${JSON.stringify(csv)}`);

  const cards: ScryfallCard[] = [];

  for await (const csvCard of readCSVObjects(csv)) {
    const cardIsNotInDbYet =
      (await cardCollection.findOne({ _id: csvCard.scryfall_id })) ===
      undefined;

    if (cardIsNotInDbYet) {
      // sleep to be a scyfall good citizen
      await sleep(100);

      console.log(`csvCard is ${csvCard}`);

      const res = await fetch(
        `https://api.scryfall.com/cards/${csvCard.scryfall_id}`
      );
      const scryfallCardResponse = await res.json();

      console.log(
        `scryfallResponse is ${JSON.stringify(scryfallCardResponse)}`
      );

      const prices = {
        usd: parseFloat(scryfallCardResponse.prices.usd),
        usdFoil: parseFloat(scryfallCardResponse.prices.usdFoil),
        eur: parseFloat(scryfallCardResponse.prices.eur),
        eurFoil: parseFloat(scryfallCardResponse.prices.eur),
        tix: parseFloat(scryfallCardResponse.prices.tix),
      };

      scryfallCardResponse.prices = prices;
      scryfallCardResponse.historicalPrices.push(
        new HistoricalPrices(new Date(), prices)
      );

      // Use scryfallId as our unique object id instead of autogenerating one
      scryfallCardResponse._id = csvCard.scryfall_id;
      scryfallCardResponse.historicalPrices = [];
      cardCollection.insertOne(scryfallCardResponse);

      console.log(
        `\ncard is ${JSON.stringify(
          scryfallCardResponse.name
        )} and costs was inserted successfully`
      );
      cards.push(scryfallCardResponse);
    }
  }

  csv.close();
  return cards;
}

function getTotalPrice(prices: number[]) {
  return prices.reduce((x, y) => {
    return x + y;
  }, 0);
}

export { sleep, mapCSVtoCards, getTotalPrice };
