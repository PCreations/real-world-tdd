import {
  createLatestArticlesQuery,
  handleLatestArticleQueryResponse,
} from "../latest-articles-query";
import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "./test-data/create-test-article";
import { createIsRecentArticle } from "../is-recent-article";

describe("createLatestArticlesQuery", () => {
  it("creates the correct graphQL query", () => {
    // arrange
    const expectedQuery = `query LatestArticles($first: Int!, $after: String, $excludedSportId: ID) {
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
    const expectedDefaultFirst = 10;
    const domain = "www.my-website.co.uk";
    const after = "some-cursor";

    // act
    const latestArticleQuery = createLatestArticlesQuery({ domain, after });

    // assert
    expect(latestArticleQuery.graphQLQuery).toEqual(expectedQuery);
    expect(latestArticleQuery.variables).toEqual({
      first: expectedDefaultFirst,
      after,
    });
    expect(latestArticleQuery.headers).toEqual({ domain });
  });

  it("defaults 'after' variable to null if not provided", () => {
    // arrange
    const domain = "www.my-website.co.uk";

    // act
    const latestArticleQuery = createLatestArticlesQuery({
      domain,
    });

    // assert
    expect(latestArticleQuery.variables.after).toBeNull();
  });

  it("throws an error if domain is missing", () => {
    // act & assert
    expect(() => createLatestArticlesQuery()).toThrow('missing "domain"');
  });

  describe("response handling", () => {
    it("retrieve only the recent articles", () => {
      // arrange
      const today = new Date();
      const articles = [
        createTestArticlePublishedOneDayAgo(today),
        createTestArticlePublishedTwoDaysAgo(today),
        createTestArticlePublishedThreeDaysAgo(today),
      ];
      const graphQLResponse = {
        data: {
          latestArticles: {
            edges: articles.map((article) => ({ node: article })),
          },
        },
      };

      // act
      const { getArticles } = handleLatestArticleQueryResponse({
        today,
        graphQLResponse,
      });

      // assert
      expect(getArticles()).toEqual(
        articles.filter(createIsRecentArticle(today))
      );
    });

    it("indicates the next 'after' variable if there is next articles to fetch", () => {
      // arrange
      const graphQLResponse = {
        data: {
          latestArticles: {
            edges: [],
            pageInfo: {
              hasNextPage: true,
              endCursor: "some-cursor",
            },
          },
        },
      };

      // act
      const { getAfter } = handleLatestArticleQueryResponse({
        graphQLResponse,
      });

      // assert
      expect(getAfter()).toEqual("some-cursor");
    });

    it("getAfter() returns null when there is no next page", () => {
      // arrange
      const graphQLResponse = {
        data: {
          latestArticles: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: "some-cursor",
            },
          },
        },
      };

      // act
      const { getAfter } = handleLatestArticleQueryResponse({
        graphQLResponse,
      });

      // assert
      expect(getAfter()).toBeNull();
    });

    it("getAfter() returns null when there is a next page but any of the articles is not recent", () => {
      // arrange
      const today = new Date();
      const articles = [
        createTestArticlePublishedOneDayAgo(today),
        createTestArticlePublishedTwoDaysAgo(today),
        createTestArticlePublishedThreeDaysAgo(today),
      ];
      const graphQLResponse = {
        data: {
          latestArticles: {
            edges: articles.map((article) => ({ node: article })),
            pageInfo: {
              hasNextPage: true,
              endCursor: "some-cursor",
            },
          },
        },
      };

      // act
      const { getAfter } = handleLatestArticleQueryResponse({
        today,
        graphQLResponse,
      });

      // assert
      expect(getAfter()).toBeNull();
    });
  });
});
