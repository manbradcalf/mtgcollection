import { Application, send } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { oakAdapter } from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import {
  viewEngine,
  handlebarsEngine,
} from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import router from "./routes.ts";

const PUBLIC_PATH = "./public";
const app = new Application();

app.use(viewEngine(oakAdapter, handlebarsEngine, { viewRoot: "./view" }));
app.use(router.routes());
app.use(router.allowedMethods());

// Serve static files (like CSS)
app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  await send(ctx, filePath, {
    root: PUBLIC_PATH,
  });
});

await app.listen({ port: 8000 });
