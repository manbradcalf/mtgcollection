import { cardCollection } from "./db.ts";
import { Card, Prices } from "./ScryfallCard.ts";
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

async function getCardByScryfallId(id: string) {
  const cardInfo = await cardCollection.findOne(
    { id: id },
    { projection: basicCardDetailsProjection }
  );
  console.log(`card is ${JSON.stringify(cardInfo)}`);
  return cardInfo;
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
// TODO: Methods like this should maybe be in a db layer?
async function addTodaysPriceToCard(id: string, priceData: Prices) {
  console.log(`${JSON.stringify(priceData)} is price data`);
  const response = await cardCollection.updateOne(
    { _id: id },
    { $push: { historicalPrices: { date: new Date(), price: priceData } } }
  );
  console.log(`db response for id ${id} `);
  return response;
}

export {
  getCards,
  getCardByScryfallId,
  getCardByName,
  addCard,
  addTodaysPriceToCard,
};
