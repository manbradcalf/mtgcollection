import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";
import { Card } from "./ScryfallCard.ts";

async function mapCSVtoCards(csvPath: string): Promise<Card[]> {
  const csv = await Deno.open(csvPath);

  const sleep = (millis: number) => {
    return new Promise((resolve) => setTimeout(resolve, millis));
  };

  const cards: Card[] = [];

  for await (const obj of readCSVObjects(csv)) {
    // sleep to be a scyfall good citizen
    sleep(100);

    const res = await fetch(
      `https://api.scryfall.com/cards/${obj.scryfall_id}`
    );
    const card = await res.json();

    console.log(
      `\ncard is ${JSON.stringify(card.name)} and costs ${card.prices.usd}`
    );
    cards.push(card);
  }

  csv.close();
  return cards;
}

function getTotalPrice(prices: number[]) {
  return prices.reduce((x,y)=>{return x+y}, 0);
}


export { mapCSVtoCards, getTotalPrice };
