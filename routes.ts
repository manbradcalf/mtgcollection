import { Router } from "https://deno.land/x/oak/mod.ts";
import { getCards, createCard } from "./controller.ts";

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = "This is the home route";
  })
  .get("/get-card", getCards)
  .post("/create-card", createCard);
export default router;
