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

  // https://cards.scryfall.io/small/front/${id.charAt(0)}/${id.charAt(1)}/${id}.jpg
  .get("/get-cards", async (ctx) => {
    const cards = await getCards(ctx);
    cards?.map((x) => {
      // todo: implement flip cards 
      // mdfc arent saving image_uris because image_uris are under
      // cardface objects.
      // however theres a pattern to constructing image_uris in scryfall so we
      // use that (for now) idk why it works
      console.log(x);
      if (x.image_uris === undefined) {
        x.image_uris = {
          normal: `https://cards.scryfall.io/normal/front/${x._id.charAt(
            0
          )}/${x._id.charAt(1)}/${x._id}.jpg`,
        };
      }
    });
    console.log(cards);
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
