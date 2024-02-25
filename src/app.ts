import express from "express";
import urlRoutes from "./routes/urls.routes";
import { redirectURL } from "./controllers/urls.controllers";
const app = express();

app.use(express.json({ limit: "16kb" }));

app.use("/api", urlRoutes);
app.route("/:alias").get(redirectURL);

export default app;
