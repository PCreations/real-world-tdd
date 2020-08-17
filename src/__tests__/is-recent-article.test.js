import { createIsRecentArticle } from "../is-recent-article";

const ONE_DAY_IN_MS = 3600 * 24 * 1000;

describe("is-recent-article", () => {
  it("returns true if the article is less than 2 days old", () => {
    // arrange
    const today = new Date("2020-08-17T13:51:14.074Z");
    const oneDayAgo = new Date(+today - ONE_DAY_IN_MS);
    const twoDaysAgo = new Date(+oneDayAgo - ONE_DAY_IN_MS);
    const oneDayAgoArticle = {
      publicationDate: oneDayAgo.toISOString(),
    };
    const twoDaysAgoArticle = {
      publicationDate: twoDaysAgo.toISOString(),
    };
    const isRecentArticle = createIsRecentArticle(today);

    // act & assert
    expect(isRecentArticle(oneDayAgoArticle)).toBe(true);
    expect(isRecentArticle(twoDaysAgoArticle)).toBe(true);
  });

  it("returns false if the article is older than 2 days", () => {
    // arrange
    const today = new Date("2020-08-17T13:51:14.074Z");
    const threeDaysAgo = new Date(+today - ONE_DAY_IN_MS * 3);
    const threeDaysAgoArticle = {
      publicationDate: threeDaysAgo.toISOString(),
    };
    const isRecentArticle = createIsRecentArticle(today);

    // act & assert
    expect(isRecentArticle(threeDaysAgoArticle)).toBe(false);
  });
});
