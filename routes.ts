import { Router, helpers } from "https://deno.land/x/oak@v7.4.0/mod.ts";
import {
  getCards,
  addCard,
  getCardByScryfallId,
  getCardByName,
  addTodaysPriceToCard,
} from "./controller.ts";
const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = "This is the home route";
  })

  .get("/get-cards", getCards)

  .get("/get-card", async (ctx) => {
    const queryParams = helpers.getQuery(ctx, { mergeParams: true });
    let cardData;
    console.log(`queryParams are ${JSON.stringify(queryParams)}`);
    if (queryParams.cardname) {
      cardData = await getCardByName(queryParams.cardname);
    }
    if (queryParams.scryfallId) {
      cardData = await getCardByScryfallId(ctx.params.id as string);
    }
    ctx.response.body = cardData;
  })

  .post("/create-card", addCard)
  .post("/update-price/:id", async (ctx) => {
    const result = ctx.request.body({type: "json"})
    const data = await result.value
    console.log(`updating price for card ${ctx.params.id}`)
    await addTodaysPriceToCard(
      ctx.params.id as string,
      data
    );
  });

export default router;
