import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";
import { cardCollection } from "./db.ts";
import { Card, HistoricalPrice, Prices } from "./ScryfallCard.ts";

async function mapCSVtoCards(csvPath: string): Promise<Card[]> {
  console.log(`calling map function, csvPath is ${csvPath}`);
  const csv = await Deno.open(csvPath);

  console.log(`the csv is ${JSON.stringify(csv)}`);
  const sleep = (millis: number) => {
    return new Promise((resolve) => setTimeout(resolve, millis));
  };

  const cards: Card[] = [];

  for await (const csvCard of readCSVObjects(csv)) {
    const cardIsNotInDbYet =
      (await cardCollection.findOne({ _id: csvCard.scryfall_id })) ===
      undefined;

    if (cardIsNotInDbYet) {
      // sleep to be a scyfall good citizen
      sleep(100);

      console.log(`csvCard is ${csvCard}`);

      const res = await fetch(
        `https://api.scryfall.com/cards/${csvCard.scryfall_id}`
      );
      const scryfallCardResponse: Card = await res.json();

      console.log(
        `scryfallResponse is ${JSON.stringify(scryfallCardResponse)}`
      );
      // Use scryfallId as our unique object id instead of autogenerating one
      const mongoCard: Card = scryfallCardResponse as Card;
      mongoCard._id = csvCard.scryfall_id;
      mongoCard.historicalPrices = [];

      // Scryfall gives us strings for prices but we want numbers
      const numPrices = new Prices(
        parseFloat(scryfallCardResponse.prices.usd),
        parseFloat(scryfallCardResponse.prices.usd),
        parseFloat(scryfallCardResponse.prices.usdFoil),
        parseFloat(scryfallCardResponse.prices.eur),
        parseFloat(scryfallCardResponse.prices.tix)
      );

      mongoCard.historicalPrices.push(
        new HistoricalPrice(new Date(), numPrices)
      );

      try {
        cardCollection.insertOne(mongoCard);
      } catch (e) {
        console.log(
          `Unable to insert scryfallCardResponse: ${JSON.stringify(
            scryfallCardResponse
          )}\nerror: ${e || e.message}`
        );
      }

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

export { mapCSVtoCards, getTotalPrice };
