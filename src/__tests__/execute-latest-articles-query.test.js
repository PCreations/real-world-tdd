import { inspect } from "util";
import {
  createExecuteLatestArticlesQuery,
  createFakeExecuteLatestArticlesQuery,
  createErroneousExecuteLatestArticlesQuery,
  createExecuteLatestArticlesQueryThatTimesOut,
  GraphQLError,
  RequestTimeoutError,
} from "../execute-latest-articles-query";
import { createTestArticle } from "./create-test-article";

expect.extend({
  toBeAnArticle(received = {}) {
    const testStory = createTestArticle();

    const firstMissingProperty = Object.keys(testStory).find(
      (property) => received[property] === undefined
    );

    return firstMissingProperty
      ? {
          pass: false,
          message: () =>
            `Missing expected field "${firstMissingProperty}" in received object ${inspect(
              received,
              { depth: 2 }
            )}`,
        }
      : {
          pass: true,
        };
  },
});

describe("executeLatestArticlesQuery", () => {
  it("correctly executes the graphQL query to retrieve latest articles for a specific domain", async () => {
    // arrange
    const executeLatestArticlesQuery = createExecuteLatestArticlesQuery();

    // act
    const response = await executeLatestArticlesQuery({
      domain: "wwww.my-website.co-uk",
    });

    // assert
    expect(response.getArticles()[0]).toBeAnArticle();
    expect(response.getNextPageCursor()).toBeDefined();
  });
  it("can be faked with predefined response for a specific domain", async () => {
    // arrange
    expect.assertions(1);
    const domain = "wwww.my-website.co-uk";
    const articles = [createTestArticle(), createTestArticle()];
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      domain,
      articlesPagesByCursor: {
        null: { articles },
      },
    });

    // act
    const response = await executeLatestArticlesQuery({
      domain,
    });

    // assert
    expect(response.getArticles()).toEqual(articles);
  });

  it("can retrieved response for a specific domain and cursor", async () => {
    // arrange
    expect.assertions(1);
    const domain = "wwww.my-website.co-uk";
    const articles = [createTestArticle(), createTestArticle()];
    const secondPageArticles = [createTestArticle(), createTestArticle()];
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      domain,
      articlesPagesByCursor: {
        null: { articles, endCursor: "some-cursor" },
        "some-cursor": { articles: secondPageArticles },
      },
    });

    // act
    const response = await executeLatestArticlesQuery({
      domain,
      after: "some-cursor",
    });

    // assert
    expect(response.getArticles()).toEqual(secondPageArticles);
  });

  it("returns the next page cursor if there is a next page to fetch", async () => {
    // arrange
    expect.assertions(1);
    const domain = "wwww.my-website.co-uk";
    const firstPage = [createTestArticle(), createTestArticle()];
    const secondPage = [createTestArticle(), createTestArticle()];
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      domain,
      articlesPagesByCursor: {
        null: { articles: firstPage, endCursor: "some-end-cursor" },
        "some-end-cursor": { articles: secondPage },
      },
    });

    // act
    const response = await executeLatestArticlesQuery({
      domain,
    });

    // assert
    expect(response.getNextPageCursor()).toEqual("some-end-cursor");
  });

  it("does not return the next page cursor if there is no next page to fetch", async () => {
    // arrange
    expect.assertions(1);
    const domain = "wwww.my-website.co-uk";
    const articles = [createTestArticle(), createTestArticle()];
    const secondPageArticles = [createTestArticle(), createTestArticle()];
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      domain,
      articlesPagesByCursor: {
        null: { articles, endCursor: "some-end-cursor" },
        "some-end-cursor": { articles: secondPageArticles },
      },
    });

    // act
    const response = await executeLatestArticlesQuery({
      domain,
      after: "some-end-cursor",
    });

    // assert
    expect(response.getNextPageCursor()).toBeNull();
  });

  it("fails with a GraphQLError if the response contains graphql errors", async () => {
    // arrange
    expect.assertions(1);
    const domain = "wwww.my-website.co-uk";
    const executeLatestArticlesQuery = createErroneousExecuteLatestArticlesQuery(
      {
        domain,
        graphQLErrors: [
          {
            message: "some error message",
          },
          {
            message: "some other error message",
          },
        ],
      }
    );

    // act & assert
    await expect(executeLatestArticlesQuery({ domain })).rejects.toEqual(
      new GraphQLError([
        {
          message: "some error message",
        },
        {
          message: "some other error message",
        },
      ])
    );
  });

  it("fails with a RequestTimeoutError if the request times out", async () => {
    // arrange
    expect.assertions(1);
    const domain = "wwww.my-website.co-uk";
    const executeLatestArticlesQuery = createExecuteLatestArticlesQueryThatTimesOut(
      { domain }
    );

    // act & assert
    await expect(executeLatestArticlesQuery({ domain })).rejects.toEqual(
      new RequestTimeoutError()
    );
  });
});
