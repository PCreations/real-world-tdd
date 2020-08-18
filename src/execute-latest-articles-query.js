/* eslint-disable max-classes-per-file */
import axios from "axios";

export class GraphQLError extends Error {
  constructor(errors) {
    super();
    this.message = errors.map((message) => message).join("\n");
  }
}

export class RequestTimeoutError extends Error {
  constructor() {
    super();
    this.message = "Request timed out";
  }
}

const StatusCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  TIME_OUT: 408,
};

const LATEST_ARTICLES_QUERY = `query LatestArticles($first: Int!) {
  latestArticles(first: $first) {
    edges {
      node {
        publicationDate
        title
        url
      }
    }
  }
}
`;

const DEFAULT_TIMEOUT_MS = 10000;

export const createExecuteLatestArticlesQuery = ({
  sendQuery = axios,
} = {}) => async ({ domain } = {}) => {
  let response;
  try {
    response = await sendQuery({
      method: "POST",
      url: process.env.GRAPHQL_API_ENDPOINT,
      data: {
        query: LATEST_ARTICLES_QUERY,
        variables: {
          first: 10,
        },
      },
      headers: {
        "Content-Type": "application/json",
        domain,
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

  return {
    getArticles() {
      return response.data.data.latestArticles.edges.map(({ node }) => node);
    },
  };
};

const fakeSendQuery = ({ responseForDomain }) => ({ headers: { domain } }) => {
  if (responseForDomain[domain]?.status !== StatusCode.SUCCESS) {
    const error = new Error();
    error.response = responseForDomain[domain];
    return Promise.reject(error);
  }
  return Promise.resolve(responseForDomain[domain]);
};

export const createFakeExecuteLatestArticlesQuery = ({
  domain: expectedDomain,
  articles,
}) => async ({ domain }) => {
  const executeLatestArticleQuery = createExecuteLatestArticlesQuery({
    sendQuery: fakeSendQuery({
      responseForDomain: {
        [expectedDomain]: {
          status: StatusCode.SUCCESS,
          data: {
            data: {
              latestArticles: {
                edges: articles.map((article) => ({
                  node: article,
                })),
              },
            },
          },
        },
      },
    }),
  });

  return executeLatestArticleQuery({ domain });
};

export const createErroneousExecuteLatestArticlesQuery = ({
  domain: expectedDomain,
  graphQLErrors,
}) => async ({ domain }) => {
  const executeLatestArticleQuery = createExecuteLatestArticlesQuery({
    sendQuery: fakeSendQuery({
      responseForDomain: {
        [expectedDomain]: {
          status: StatusCode.BAD_REQUEST,
          data: {
            errors: graphQLErrors,
          },
        },
      },
    }),
  });

  return executeLatestArticleQuery({ domain });
};

export const createExecuteLatestArticlesQueryThatTimesOut = () => async ({
  domain,
}) => {
  const executeLatestArticleQuery = createExecuteLatestArticlesQuery({
    sendQuery: fakeSendQuery({
      responseForDomain: {
        [domain]: {
          status: StatusCode.TIME_OUT,
        },
      },
    }),
  });

  return executeLatestArticleQuery({ domain });
};
