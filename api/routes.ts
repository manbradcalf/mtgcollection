import { Router, helpers, send } from "../deps.ts";
import {
  addCard,
  getCards,
  getCardByScryfallId,
  getCardsByName,
  addTodaysPriceToCard,
  updateAllPrices,
} from "./controller.ts";
import { sleep } from "../util/mapper.ts";

const router = new Router();
router
  .get("/", async (ctx) => {
    console.log("called /");
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}/view`,
      index: "index.html",
    });
  })

  .get("/get-cards", async (ctx) => {
    const cards = await getCards(ctx);
    await ctx.render(
      "list.handlebars",
      cards.sort((a, b) => {
        return Number(b.prices.usd) - Number(a.prices.usd);
      })
    );
  })

  .get("/get-card", async (ctx) => {
    const queryParams = helpers.getQuery(ctx, { mergeParams: true });
    let cardData;
    if (queryParams.scryfallId) {
      cardData = await getCardByScryfallId(queryParams.scryfallId);
    } else if (queryParams.cardname) {
      cardData = await getCardsByName(queryParams.cardname);
    }
    console.log(cardData);
    await ctx.render("detail.handlebars", cardData);
  })

  .post("/sleep", async (ctx) => {
    const requestBody: { ms: number } = await ctx.request.body().value;
    await sleep(requestBody.ms);
    ctx.response.body = "You slept " + requestBody.ms;
  })
  .post("/create-card", addCard)
  .post("/update-price/:id", addTodaysPriceToCard)
  .post("/update-all-prices", (ctx) => {
    updateAllPrices();
    ctx.response.body = "Submitted";
    ctx.response.status = 201;
  });

export default router;
