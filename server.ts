import { Application } from "./deps.ts";
import router from "./routes.ts";

const app = new Application();
const PORT = 8000;

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: PORT });
