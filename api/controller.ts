import { cardCollection } from "../db.ts";
import { ScryfallCard, PricesResponse, Prices } from "../types/ScryfallCard.ts";
import { RouterContext, helpers } from "https://deno.land/x/oak/mod.ts";
import { basicCardDetailsProjection } from "../util/queryProjections.ts";
import { sleep } from "../util/mapper.ts";
console.log("in controller.ts...");

const getCards = async (ctx: RouterContext) => {
  const queryParams = helpers.getQuery(ctx);
  console.log(queryParams);
  const mongoQuery: any = {};
  if (queryParams.minPrice) {
    mongoQuery["prices.usd"] = { $gt: parseFloat(queryParams.minPrice) };
  }
  if (queryParams.typeLine) {
    mongoQuery.type_line = { $regex: queryParams.typeLine, $options: "i" };
  }
  if (queryParams.cardName) {
    mongoQuery.name = {
      $regex: queryParams.cardName,
      $options: "i",
    };
  }
  if (queryParams.oracleText) {
    mongoQuery.oracle_text = {
      $regex: queryParams.oracleText,
      $options: "i",
    };
  }

  const colorIdentity = [];
  if (queryParams.w === "on") {
    colorIdentity.push("W");
  }
  if (queryParams.u === "on") {
    colorIdentity.push("U");
  }
  if (queryParams.b === "on") {
    colorIdentity.push("B");
  }
  if (queryParams.r === "on") {
    colorIdentity.push("R");
  }
  if (queryParams.g === "on") {
    colorIdentity.push("G");
  }
  if (colorIdentity.length !== 0) {
    console.log(colorIdentity);
    mongoQuery.color_identity = {
      $all: colorIdentity,
    };
  }
  if (queryParams.minCmc) {
    mongoQuery.cmc = {
      $gte: parseInt(queryParams.minCmc),
    };
  }
  if (queryParams.maxCmc) {
    mongoQuery.cmc = {
      $lte: parseInt(queryParams.maxCmc),
    };
  }

  try {
    const cards = await cardCollection
      .find(mongoQuery, { projection: basicCardDetailsProjection })
      .toArray();
    return cards;
  } catch (err) {
    console.log(err);
    ctx.response.body = { status: false, data: null };
    ctx.response.status = 500;
  }
};

async function findCards(mongoQuery: any) {
  await cardCollection
    .find(mongoQuery, { projection: basicCardDetailsProjection })
    .toArray();
}

async function getCardByScryfallId(id: string): Promise<ScryfallCard> {
  const cardInfo = await cardCollection.findOne({ id: id });
  return cardInfo as ScryfallCard;
}

async function getCardsByName(cardName: string) {
  console.log("in controller, getCardsByName(" + cardName + ")");
  const cardInfo = await cardCollection
    .find(
      {
        name: { $regex: cardName, $options: "i" },
      },
      { projection: basicCardDetailsProjection }
    )
    .toArray();
  return cardInfo;
}

async function getCardsByOracleText(oracleText: string) {
  console.log(`finding ${oracleText}`);

  const cardInfo = await cardCollection
    .find(
      {
        oracle_text: { $regex: oracleText, $options: "i" },
      },
      { projection: basicCardDetailsProjection }
    )
    .toArray();
  return cardInfo;
}

async function getCardsThatCostAtLeast(price: number) {
  const cards = await cardCollection
    .find({
      historicalPrices: { $elemMatch: { "price.usd": { $gt: price } } },
    })
    .toArray();

  return cards;
}

const addTodaysPriceToCard = async (ctx: RouterContext) => {
  if (ctx.params.id) {
    const card: ScryfallCard = await getCardByScryfallId(ctx.params.id);
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

const addCard = async (ctx: RouterContext) => {
  // todo: implement flip cards
  try {
    const card: ScryfallCard = await ctx.request.body().value;
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

async function updateAllPrices() {
  const cards: ScryfallCard[] = await cardCollection.find().toArray();
  for (const i in cards) {
    // todo get scryfall price using id
    await sleep(100);
    const res = await fetch(`https://api.scryfall.com/cards/${cards[i]._id}`);
    const scryfallCardResponse: ScryfallCard = await res.json();
    if (scryfallCardResponse.prices) {
      console.log(
        `prices for ${scryfallCardResponse.name}:\n ${JSON.stringify(
          scryfallCardResponse.prices
        )}\n`
      );

      const prices: Prices = {
        usd: parseFloat(scryfallCardResponse.prices?.usd),
        usdFoil: parseFloat(scryfallCardResponse.prices?.usdFoil),
        eur: parseFloat(scryfallCardResponse.prices?.eur),
        eurFoil: parseFloat(scryfallCardResponse.prices?.eurFoil),
        tix: parseFloat(scryfallCardResponse.prices?.tix),
      };

      const updateResponse = await cardCollection.updateOne(
        { _id: cards[i]._id },
        {
          $set: {
            prices: prices,
          },
          $push: {
            historicalPrices: {
              date: new Date(),
              price: prices,
            },
          },
        }
      );

      console.log(
        `updated: \n${JSON.stringify(updateResponse)}\n${
          scryfallCardResponse.name
        } is now ${JSON.stringify(scryfallCardResponse.prices)}`
      );
    } else {
      console.log("NO PRICES FOR " + scryfallCardResponse.name);
    }
  }
}

export {
  getCards,
  getCardByScryfallId,
  getCardsByName,
  getCardsByOracleText,
  getCardsThatCostAtLeast,
  addCard,
  addTodaysPriceToCard,
  updateAllPrices,
  findCards,
};
