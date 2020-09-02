import express from "express";
import cors from "cors";

export const createTestServer = ({ port }) => {
  let server;
  const lastSentRequest = {};
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());

  app.post("/", (req, res) => {
    lastSentRequest.body = req.body;
    lastSentRequest.headers = req.headers;
    res.sendStatus(200);
  });

  return {
    listen(callback) {
      server = app.listen(port, callback);
    },
    close(callback) {
      server.close(callback);
    },
    getLastSentRequest() {
      return lastSentRequest;
    },
  };
};
