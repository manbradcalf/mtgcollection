import { Router } from "https://deno.land/x/oak/mod.ts";
import { getCards, addCard, getCardByScryfallId } from "./controller.ts";
const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = "This is the home route";
  })

  .get("/get-cards", getCards)

  .get("/get-card/:id", async (ctx) => {
    const cardData = await getCardByScryfallId(ctx.params.id as string);
    ctx.response.body = cardData;
  })

  .post("/create-card", addCard);

export default router;
