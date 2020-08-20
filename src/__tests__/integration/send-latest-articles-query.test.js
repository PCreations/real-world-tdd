import { inspect } from "util";
import { createSendLatestArticlesQuery } from "../../send-latest-articles-query";
import { createTestArticle } from "../test-data/create-test-article";

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
    const executeLatestArticlesQuery = createSendLatestArticlesQuery();

    // act
    const response = await executeLatestArticlesQuery({
      domain: "wwww.my-website.co-uk",
    });

    // assert
    expect(response.getArticles()[0]).toBeAnArticle();
    expect(response.getNextPageCursor()).toBeDefined();
  });
});
