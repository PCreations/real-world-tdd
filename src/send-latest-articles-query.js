/* eslint-disable max-classes-per-file */
import axios from "axios";

export class GraphQLError extends Error {
  constructor(errors) {
    super();
    this.message = errors.map(({ message }) => message).join("\n");
  }
}

export class RequestTimeoutError extends Error {
  constructor() {
    super();
    this.message = "Request timed out";
  }
}

const StatusCode = {
  BAD_REQUEST: 400,
  TIME_OUT: 408,
};

const DEFAULT_TIMEOUT_MS = 10000;

export const createSendLatestArticlesQuery = ({
  sendQuery = axios,
} = {}) => async ({ graphQLQuery, variables, headers } = {}) => {
  let response;
  try {
    response = await sendQuery({
      method: "POST",
      url: process.env.GRAPHQL_API_ENDPOINT,
      data: {
        query: graphQLQuery,
        variables,
      },
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      timeout: DEFAULT_TIMEOUT_MS,
    });
  } catch (error) {
    if (error.response.status === StatusCode.BAD_REQUEST) {
      throw new GraphQLError(error.response.data.errors);
    }
    if (error.response.status === StatusCode.TIME_OUT) {
      throw new RequestTimeoutError();
    }
  }

  return response.data;
};
