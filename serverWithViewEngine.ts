import { Application} from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { oakAdapter } from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import {
  viewEngine,
  handlebarsEngine,
} from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import router from "./routes.ts";

const app = new Application();

app.use(viewEngine(oakAdapter, handlebarsEngine, {viewRoot: "./view"}));
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

