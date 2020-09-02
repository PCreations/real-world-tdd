import express from "express";
import cors from "cors";

export const createTestServer = ({ port }) => {
  let server;
  const response = {
    status: 200,
    body: {},
  };
  const lastSentRequest = {};
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());

  app.post("/", (req, res) => {
    lastSentRequest.body = req.body;
    lastSentRequest.headers = req.headers;
    res.status(response.status).send(response.body);
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
    setResponse({ status, body }) {
      response.status = status;
      response.body = body;
    },
  };
};
