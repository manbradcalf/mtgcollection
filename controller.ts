import { cardCollection } from "./db.ts";
import { Card, PricesResponse, Prices } from "./types/ScryfallCard.ts";
import { RouterContext, helpers } from "https://deno.land/x/oak/mod.ts";
import { basicCardDetailsProjection } from "./queryProjections.ts";
import { sleep } from "./mapper.ts";
console.log('in controller.ts...')
const getCards = async (ctx: RouterContext) => {
  const queryParams = helpers.getQuery(ctx, { mergeParams: true });
  // TODO: How to properly handle multiple query params
  if (queryParams.minPrice) {
    try {
      const price = parseFloat(queryParams.minPrice);
      const cards = await getCardsThatCostAtLeast(price);

      ctx.response.body = { status: true, data: cards };
      ctx.response.status = 200;
    } catch (err) {
      ctx.response.body = { status: false, data: err.message };
      ctx.response.status = 500;
    }
  } else if (queryParams.cardname) {
    try {
      const data = await getCardsByName(queryParams.cardname);
      console.log(`returning data: \n ${JSON.stringify(data)}`);
      ctx.response.body = { status: true, data: data };
      ctx.response.status = 200;
    } catch (err) {
      ctx.response.body = { status: false, data: null };
      ctx.response.status = 500;
      console.log(err);
    }
  } else if (queryParams.oracletext) {
    try {
      const data = await getCardsByOracleText(queryParams.oracletext);
      console.log(`returning data: \n ${JSON.stringify(data)}`);
      ctx.response.body = { status: true, data: data };
      ctx.response.status = 200;
    } catch (err) {
      ctx.response.body = { status: false, data: null };
      ctx.response.status = 500;
      console.log(err);
    }
  }
};

async function getCardByScryfallId(id: string): Promise<Card> {
  const cardInfo = await cardCollection.findOne({ id: id });
  return cardInfo as Card;
}

const addCard = async (ctx: RouterContext) => {
  try {
    const card: Card = await ctx.request.body().value;
    console.log(card);
    const id = await cardCollection.insertOne(card);
    ctx.response.body = { status: true, data: id };
    ctx.response.status = 201;
  } catch (err) {
    ctx.response.body = { status: false, data: null };
    ctx.response.status = 500;
    console.log(err);
  }
};

async function getCardsByName(cardName: string) {
  console.log("in controller, getCardsByName("+cardName+")")
  const cardInfo = await cardCollection
    .find(
      {
        name: { $regex: cardName, $options: 'i' },
      },
      { projection: basicCardDetailsProjection }
    )
    .toArray();
  return cardInfo;
}

async function getCardsByOracleText(oracleText: string) {
  console.log(`finding ${oracleText}`)
  
  const cardInfo = await cardCollection
    .find(
      {
        oracle_text: { $regex: oracleText, $options: 'i' },
      },
      { projection: basicCardDetailsProjection }
    )
    .toArray();
  return cardInfo;
}

const addTodaysPriceToCard = async (ctx: RouterContext) => {
  if (ctx.params.id) {
    const card: Card = await getCardByScryfallId(ctx.params.id);
    const price: PricesResponse = card.prices;
    const response = await cardCollection.updateOne(
      { _id: ctx.params.id },
      { $push: { historicalPrices: { date: new Date(), price: price } } }
    );
    ctx.response.body = { status: true, data: response };
    ctx.response.status = 200;
  } else {
    ctx.response.body = {
      status: false,
      data: { message: `Unable to update card price for ${ctx.params.id}` },
    };
  }
};

async function getCardsThatCostAtLeast(price: number) {
  const cards = await cardCollection
    .find({
      historicalPrices: { $elemMatch: { "price.usd": { $gt: price } } },
    })
    .toArray();

  return cards;
}

async function updateAllPrices() {
  const cards = await cardCollection.find().toArray();
  cards.forEach(async (card) => {
    // todo get scryfall price using id
    sleep(100);
    const res = await fetch(`https://api.scryfall.com/cards/${card._id}`);
    const scryfallCardResponse: Card = await res.json();
    console.log(`res is ${scryfallCardResponse.prices}`);

    const prices: Prices = new Prices(
      parseFloat(scryfallCardResponse.prices.usd),
      parseFloat(scryfallCardResponse.prices.usdFoil),
      parseFloat(scryfallCardResponse.prices.eur),
      parseFloat(scryfallCardResponse.prices.eurFoil),
      parseFloat(scryfallCardResponse.prices.tix)
    );
    const updateResponse = await cardCollection.updateOne(
      { _id: card._id },
      {
        $push: {
          historicalPrices: {
            date: new Date(),
            price: prices,
          },
        },
      }
    );

    console.log(
      `updated: \n${JSON.stringify(
        updateResponse
      )}\nprice is now ${JSON.stringify(scryfallCardResponse.prices)}`
    );
  });
}

export {
  getCards,
  getCardByScryfallId,
  getCardsByName,
  getCardsByOracleText,
  addCard,
  addTodaysPriceToCard,
  updateAllPrices,
};
