import { cardCollection } from "./db.ts";
import { Card, PricesResponse } from "./ScryfallCard.ts";
import { RouterContext } from "https://deno.land/x/oak@v7.4.0/mod.ts";
import { basicCardDetailsProjection } from "./queryProjections.ts";

const getCards = async (ctx: RouterContext) => {
  try {
    const data = await cardCollection.find().toArray();
    ctx.response.body = { status: true, data: data };
    ctx.response.status = 200;
  } catch (err) {
    ctx.response.body = { status: false, data: null };
    ctx.response.status = 500;
    console.log(err);
  }
};

async function getCardByScryfallId(id: string): Promise<Card> {
  const cardInfo = await cardCollection.findOne({ id: id });
  console.log(`card is ${JSON.stringify(cardInfo)}`);
  return cardInfo as Card;
}

const addCard = async (ctx: RouterContext) => {
  try {
    let body: any = await ctx.request.body();
    console.log(await body.value);
    const card: Card = await body.value;
    const id = await cardCollection.insertOne(card);
    ctx.response.body = { status: true, data: id };
    ctx.response.status = 201;
  } catch (err) {
    ctx.response.body = { status: false, data: null };
    ctx.response.status = 500;
    console.log(err);
  }
};

async function getCardByName(cardName: string) {
  const cardInfo = await cardCollection.findOne(
    {
      name: { $regex: cardName },
    },
    { projection: basicCardDetailsProjection }
  );
  console.log(`card info is ${cardInfo}`);
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

export {
  getCards,
  getCardByScryfallId,
  getCardByName,
  addCard,
  addTodaysPriceToCard,
};
