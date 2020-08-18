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
  });
  it("can be faked with predefined response for a specific domain", async () => {
    // arrange
    expect.assertions(1);
    const domain = "wwww.my-website.co-uk";
    const articles = [createTestArticle(), createTestArticle()];
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      domain,
      articles,
    });

    // act
    const response = await executeLatestArticlesQuery({ domain });

    // assert
    expect(response.getArticles()[0]).toBeAnArticle();
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
    const executeLatestArticlesQuery = createExecuteLatestArticlesQueryThatTimesOut();

    // act & assert
    await expect(executeLatestArticlesQuery({ domain })).rejects.toEqual(
      new RequestTimeoutError()
    );
  });
});
