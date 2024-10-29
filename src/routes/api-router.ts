import { Router, json } from "express";
import ChatEngine from "../ChatEngine";

const apiRouter = Router();

apiRouter.use(json());

apiRouter.get("/info", (_req, res) => {
  const sessionUuid = ChatEngine.getSessionUuid();
  const apiVersion = 1;
  res.json({ sessionUuid, apiVersion });
});

apiRouter.get("/messages/all", (_req, res) => {
  const messages = ChatEngine.getAllMessages();
  res.json(messages);
});

apiRouter.get("/messages/latest", (_req, res) => {
  const messages = ChatEngine.getLatestMessages();
  res.json(messages);
});

apiRouter.get("/messages/older/:uuid", (req, res) => {
  const messages = ChatEngine.getOlderMessages(req.params.uuid);
  res.json(messages);
});

apiRouter.get("/messages/updates/:time", (req, res) => {
  const time = parseInt(req.params.time, 10);
  if (!time) {
    res.sendStatus(400);
    return;
  }
  const messages = ChatEngine.getMessageUpdates(time);
  res.json(messages);
});

apiRouter.post("/messages/new/", (req, res) => {
  if (typeof req.body?.text !== "string") {
    res.sendStatus(400);
    return;
  }
  const message = ChatEngine.addNewMessage(req.body.text);
  res.json(message);
});

apiRouter.get("/participants/all", (_req, res) => {
  const participants = ChatEngine.getAllParticipants();
  res.json(participants);
});

apiRouter.get("/participants/updates/:time", (req, res) => {
  const time = parseInt(req.params.time, 10);
  if (!time) {
    res.sendStatus(400);
    return;
  }
  const participants = ChatEngine.getParticipantUpdates(time);
  res.json(participants);
});

export default apiRouter;
