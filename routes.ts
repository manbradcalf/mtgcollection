import { Router } from "https://deno.land/x/oak/mod.ts";
import { getCards, getCard, createCard } from "./controller.ts";

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = "This is the home route";
  })
  .get("/get-cards", getCards)
  .get("/get-card/:id", (ctx) => {
    getCard(ctx,ctx.params.id);
  })
  .post("/create-card", createCard);

export default router;
