import { cardCollection } from "./db.ts";
import { Card } from "./ScryfallCard.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { basicCardDetails } from "./queryProjections.ts";
const getCards = async (ctx: RouterContext) => {
  // try {
  //   const data = await cardCollection.findOne({ dbName: `cards` });
  //   ctx.response.body = { status: true, data: data };
  //   ctx.response.status = 200;
  // } catch (err) {
  //   ctx.response.body = { status: false, data: null };
  //   ctx.response.status = 500;
  //   console.log(err);
  // }
};

async function getCardByScryfallId(id:string) {
  const cardInfo = await cardCollection.findOne(
    { id: id },
    { projection: basicCardDetails }
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
export { getCards, getCardByScryfallId, addCard };
