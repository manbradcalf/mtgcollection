import { Application } from "https://deno.land/x/oak/mod.ts";
const app = new Application();
import router from "./routes.ts";
const PORT = 3000;

router.get("/", (ctx) => {
  ctx.response.body = "This is the home route";
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: PORT });
