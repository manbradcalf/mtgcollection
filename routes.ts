import { Router, helpers, send } from "https://deno.land/x/oak/mod.ts";
import {
  getCards,
  addCard,
  getCardByScryfallId,
  getCardsByName,
  addTodaysPriceToCard,
  updateAllPrices,
  getCardsByOracleText,
} from "./controller.ts";

const router = new Router();
console.log("initialized Router")
router
  .get("/", async (ctx) => {
    console.log('called /')
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}/view`,
      index: "index.html",
    });
  })

  .get("/get-cards", async (ctx) => {
    const queryParams = helpers.getQuery(ctx, { mergeParams: true });
    let cards;
    if (queryParams.oracletext) {
      cards = await getCardsByOracleText(queryParams.oracletext)
    }
    if (queryParams.cardname) {
      cards = await getCardsByName(queryParams.cardname)
    }
    ctx.response.body = cards
  })

  .get("/get-card", async (ctx) => {
    const queryParams = helpers.getQuery(ctx, { mergeParams: true });
    let cardData;
    if (queryParams.scryfallId) {
      cardData = await getCardByScryfallId(ctx.params.id as string);
    }
    ctx.response.body = cardData;
  })

  .post("/create-card", addCard)
  .post("/update-price/:id", addTodaysPriceToCard)
  .post("/update-all-prices", async (ctx) => {
    await updateAllPrices();
  });

export default router;
