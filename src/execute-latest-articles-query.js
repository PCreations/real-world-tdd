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

export const executeLatestArticlesQuery = async ({ domain }) => {
  const response = await axios({
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
