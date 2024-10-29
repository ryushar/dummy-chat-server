"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatEngine_1 = require("../ChatEngine");
const apiRouter = (0, express_1.Router)();
apiRouter.use((0, express_1.json)());
apiRouter.get("/info", (_req, res) => {
    const sessionUuid = ChatEngine_1.default.getSessionUuid();
    const apiVersion = 1;
    res.json({ sessionUuid, apiVersion });
});
apiRouter.get("/messages/all", (_req, res) => {
    const messages = ChatEngine_1.default.getAllMessages();
    res.json(messages);
});
apiRouter.get("/messages/latest", (_req, res) => {
    const messages = ChatEngine_1.default.getLatestMessages();
    res.json(messages);
});
apiRouter.get("/messages/older/:uuid", (req, res) => {
    const messages = ChatEngine_1.default.getOlderMessages(req.params.uuid);
    res.json(messages);
});
apiRouter.get("/messages/updates/:time", (req, res) => {
    const time = parseInt(req.params.time, 10);
    if (!time) {
        res.sendStatus(400);
        return;
    }
    const messages = ChatEngine_1.default.getMessageUpdates(time);
    res.json(messages);
});
apiRouter.post("/messages/new/", (req, res) => {
    if (typeof req.body?.text !== "string") {
        res.sendStatus(400);
        return;
    }
    const message = ChatEngine_1.default.addNewMessage(req.body.text);
    res.json(message);
});
apiRouter.get("/participants/all", (_req, res) => {
    const participants = ChatEngine_1.default.getAllParticipants();
    res.json(participants);
});
apiRouter.get("/participants/updates/:time", (req, res) => {
    const time = parseInt(req.params.time, 10);
    if (!time) {
        res.sendStatus(400);
        return;
    }
    const participants = ChatEngine_1.default.getParticipantUpdates(time);
    res.json(participants);
});
exports.default = apiRouter;
