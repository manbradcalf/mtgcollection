import { cardCollection } from "./db.ts";
import { Card } from "./ScryfallCard.ts";

const getCards = async (ctx: any) => {
  try {
    const data = await cardCollection.find({ dbName: `cards` });
    ctx.response.body = { status: true, data: data };
    ctx.response.status = 200;
  } catch (err) {
    ctx.response.body = { status: false, data: null };
    ctx.response.status = 500;
    console.log(err);
  }
};

const getCard = async (ctx: any, id: any) => {
  try {
    const data = await cardCollection.find({ _id: id });
    ctx.response.body = { status: true, data: data };
    ctx.response.status = 200;
  } catch (err) {
    ctx.response.body = { status: false, data: null };
    ctx.response.status = 500;
    console.log(err);
  }
};

const createCard = async (ctx: any) => {
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
export { getCards, getCard, createCard };
