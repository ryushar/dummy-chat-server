import { Router, json } from "express";
import ChatEngine from "../ChatEngine";

const apiRouter = Router();

apiRouter.use(json());

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
  const messages = ChatEngine.getMessageUpdates(time);
  res.json(messages);
});

apiRouter.get("/participants/all", (_req, res) => {
  const participants = ChatEngine.getAllParticipants();
  res.json(participants);
});

apiRouter.get("/participants/updates/:time", (req, res) => {
  const time = parseInt(req.params.time, 10);
  const participants = ChatEngine.getParticipantUpdates(time);
  res.json(participants);
});

export default apiRouter;
