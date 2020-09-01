import { createIsRecentArticle } from "../is-recent-article";

const ONE_DAY_IN_MS = 3600 * 24 * 1000;

describe("isRecentArticle", () => {
  const today = new Date("2020-09-01T12:07:23.997Z");
  const oneDayAgo = new Date(+today - ONE_DAY_IN_MS);
  const twoDaysAgo = new Date(+oneDayAgo - ONE_DAY_IN_MS);
  const threeDaysAgo = new Date(+twoDaysAgo - ONE_DAY_IN_MS);
  it("returns true if the article is less than 2 days old", () => {
    // arrange
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

  it("returns false is the article is more than 2 days old", () => {
    // arrange
    const threeDaysAgoArticle = {
      publicationDate: threeDaysAgo.toISOString(),
    };
    const isRecentArticle = createIsRecentArticle(today);

    // act & assert
    expect(isRecentArticle(threeDaysAgoArticle)).toBe(false);
  });
});
