import axios from "axios";

export class GraphQLError extends Error {
  constructor(graphQLErrors = []) {
    super();
    this.message = `GraphQL errors : ${graphQLErrors
      .map(({ message }) => message)
      .join("\n")}`;
  }
}

const LATEST_ARTICLES_QUERY = `
  query {
    latestArticles {
      publicationDate
      title
      url
    }
  }
`;

export const createExecuteLatestArticlesQuery = ({
  sendQuery = axios,
} = {}) => ({ domain, graphQLEndpoint }) =>
  sendQuery({
    url: graphQLEndpoint,
    method: "POST",
    data: {
      query: LATEST_ARTICLES_QUERY,
    },
    headers: {
      "content-type": "application/json",
      domain,
    },
  })
    .then((response) => response.data.data.latestArticles)
    .catch((error) => {
      throw new GraphQLError(error.response.data.errors);
    });

const fakeSendQuery = (articlesForDomain) => (request) =>
  Promise.resolve({
    data: {
      data: {
        latestArticles: articlesForDomain[request.headers.domain],
      },
    },
  });

export const createFakeExecuteLatestArticlesQuery = (articlesForDomain) =>
  createExecuteLatestArticlesQuery({
    sendQuery: fakeSendQuery(articlesForDomain),
  });
