import axios from "axios";

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

export const createExecuteLatestArticlesQuery = ({
  sendQuery = axios,
} = {}) => async ({ domain }) => {
  const response = await sendQuery({
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
  });

  return {
    getArticles() {
      return response.data.data.latestArticles.edges.map(({ node }) => node);
    },
  };
};

const fakeSendQuery = ({ responseForDomain }) => async ({
  headers: { domain },
}) => responseForDomain[domain];

export const createFakeExecuteLatestArticlesQuery = ({ responseForDomain }) =>
  createExecuteLatestArticlesQuery({
    sendQuery: fakeSendQuery({ responseForDomain }),
  });
