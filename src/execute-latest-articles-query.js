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

const LATEST_ARTICLES_QUERY = `query LatestArticles($first: Int!, $after: String) {
  latestArticles(first: $first) {
    edges {
      node {
        publicationDate
        title
        url
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

const DEFAULT_TIMEOUT_MS = 10000;

export const createExecuteLatestArticlesQuery = ({
  sendQuery = axios,
} = {}) => async ({ domain, after = null } = {}) => {
  let response;
  try {
    response = await sendQuery({
      method: "POST",
      url: process.env.GRAPHQL_API_ENDPOINT,
      data: {
        query: LATEST_ARTICLES_QUERY,
        variables: {
          first: 10,
          after,
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

  const { latestArticles } = response.data.data;

  return {
    getArticles() {
      return latestArticles.edges.map(({ node }) => node);
    },
    getNextPageCursor() {
      return latestArticles.pageInfo.hasNextPage
        ? latestArticles.pageInfo.endCursor
        : null;
    },
  };
};

const fakeSendQuery = ({ getResponseByDomainAndCursor }) => ({
  data: {
    variables: { after },
  },
  headers: { domain },
}) => {
  const response = getResponseByDomainAndCursor({ domain, after });
  if (response.status !== StatusCode.SUCCESS) {
    const error = new Error();
    error.response = response;
    return Promise.reject(error);
  }
  return Promise.resolve(response);
};

export const createFakeExecuteLatestArticlesQuery = ({
  domain: expectedDomain,
  articlesPagesByCursor = {},
}) => {
  const getResponseByDomainAndCursor = ({ domain, after }) => {
    if (domain === expectedDomain) {
      const { endCursor } = articlesPagesByCursor[after];
      const hasNextPage = articlesPagesByCursor[endCursor] !== undefined;
      return {
        status: StatusCode.SUCCESS,
        data: {
          data: {
            latestArticles: {
              edges: articlesPagesByCursor[after].articles.map((article) => ({
                node: article,
              })),
              pageInfo: {
                hasNextPage,
                endCursor,
              },
            },
          },
        },
      };
    }
    return {};
  };

  return createExecuteLatestArticlesQuery({
    sendQuery: fakeSendQuery({
      getResponseByDomainAndCursor,
    }),
  });
};

export const createErroneousExecuteLatestArticlesQuery = ({
  domain: expectedDomain,
  graphQLErrors,
}) => {
  const getResponseByDomainAndCursor = ({ domain }) =>
    domain === expectedDomain
      ? {
          status: StatusCode.BAD_REQUEST,
          data: {
            errors: graphQLErrors,
          },
        }
      : {};

  return createExecuteLatestArticlesQuery({
    sendQuery: fakeSendQuery({
      getResponseByDomainAndCursor,
    }),
  });
};

export const createExecuteLatestArticlesQueryThatTimesOut = ({
  domain: expectedDomain,
}) => {
  const getResponseByDomainAndCursor = ({ domain }) =>
    domain === expectedDomain
      ? {
          status: StatusCode.TIME_OUT,
        }
      : {};
  return createExecuteLatestArticlesQuery({
    sendQuery: fakeSendQuery({
      getResponseByDomainAndCursor,
    }),
  });
};
