import { Application } from "https://deno.land/x/oak@v7.4.0/mod.ts";
const app = new Application();
import router from "./routes.ts";
const PORT = 3000;

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: PORT });
