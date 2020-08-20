import { createIsRecentArticle } from "./is-recent-article";

const LATEST_ARTICLES_QUERY = `query LatestArticles($first: Int!, $after: String, $excludedSportId: ID) {
  latestArticles(first: $first, after: $after, excludedSportId: $excludedSportId) {
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

const FIRST = 10;

const required = (message) => {
  throw new Error(message);
};

export const createLatestArticlesQuery = ({
  domain = required('missing "domain"'),
  after = null,
} = {}) => ({
  graphQLQuery: LATEST_ARTICLES_QUERY,
  variables: {
    first: FIRST,
    after,
  },
  headers: {
    domain,
  },
});

export const handleLatestArticleQueryResponse = ({
  today = new Date(),
  graphQLResponse,
}) => {
  const isRecent = createIsRecentArticle(today);
  const { edges, pageInfo } = graphQLResponse.data.latestArticles;

  const parsedNodeArticles = edges.map(({ node }) => node);

  return {
    getArticles() {
      return parsedNodeArticles.filter(isRecent);
    },
    getAfter() {
      return parsedNodeArticles.every(isRecent) && pageInfo.hasNextPage
        ? pageInfo.endCursor
        : null;
    },
  };
};
