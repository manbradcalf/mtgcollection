import { Application } from "https://deno.land/x/oak@v7.4.0/mod.ts";
import router from "./routes.ts";
const app = new Application();
const PORT = 8000;

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: PORT });
