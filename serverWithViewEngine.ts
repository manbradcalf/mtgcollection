import { Application, helpers } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { oakAdapter } from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import {
  viewEngine,
  handlebarsEngine,
} from "https://deno.land/x/view_engine@v10.6.0/mod.ts";

const viewConfig: ViewConfig = {
  viewRoot: <string>"./views", // default: "", specify the root path, it can be remote address
};
const app = new Application();

app.use(
  viewEngine(oakAdapter, handlebarsEngine, {
    viewRoot: "./view",
  })
);

app.use(async (ctx, next) => {
  const queryParams = helpers.getQuery(ctx, { mergeParams: true });
  ctx.render("index.handlebars", { cardname:  queryParams.cardname});
});

app.use(async (ctx, next)=> {
  ctx.render("index.handlebars", {cardname: helpers.getQuery(ctx)})
})

await app.listen({ port: 8000 });
