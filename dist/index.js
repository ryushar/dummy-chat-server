"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const api_router_1 = require("./routes/api-router");
const ChatEngine_1 = require("./ChatEngine");
const app = express();
const port = parseInt(process.env.PORT ?? "14000");
app.disable("x-powered-by");
app.use(cors());
app.use("/api", api_router_1.default);
app.get("/*", (_req, res) => {
    res.setHeader("content-type", "text/plain");
    res.send("Dummy chat server");
});
app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});
ChatEngine_1.default.setup();
ChatEngine_1.default.start();
