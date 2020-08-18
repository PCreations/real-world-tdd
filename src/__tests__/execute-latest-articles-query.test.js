import { inspect } from "util";
import {
  createExecuteLatestArticlesQuery,
  createFakeExecuteLatestArticlesQuery,
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
    const domain = "wwww.my-website.co-uk";
    const predifinedResponse = {
      data: {
        data: {
          latestArticles: {
            edges: [
              {
                node: createTestArticle(),
              },
            ],
          },
        },
      },
    };
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      responseForDomain: {
        [domain]: predifinedResponse,
      },
    });

    // act
    const response = await executeLatestArticlesQuery({ domain });

    // assert
    expect(response.getArticles()[0]).toBeAnArticle();
  });
});
