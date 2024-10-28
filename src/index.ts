import * as express from "express";
import * as cors from "cors";

import apiRouter from "./routes/api-router";
import ChatEngine from "./ChatEngine";

const app = express();
const port = parseInt(process.env.PORT ?? "14000");

app.disable("x-powered-by");

app.use(cors());

app.use("/api", apiRouter);

app.get("/*", (_req, res) => {
  res.setHeader("content-type", "text/plain");
  res.send("Dummy chat server");
});

app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});

ChatEngine.setup();
ChatEngine.start();
