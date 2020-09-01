import { createIsRecentArticle } from "../is-recent-article";
import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "./data/create-test-article";

describe("isRecentArticle", () => {
  const today = new Date("2020-09-01T12:07:23.997Z");
  it("returns true if the article is less than 2 days old", () => {
    // arrange
    const oneDayAgoArticle = createTestArticlePublishedOneDayAgo({ today });
    const twoDaysAgoArticle = createTestArticlePublishedTwoDaysAgo({ today });
    const isRecentArticle = createIsRecentArticle(today);

    // act & assert
    expect(isRecentArticle(oneDayAgoArticle)).toBe(true);
    expect(isRecentArticle(twoDaysAgoArticle)).toBe(true);
  });

  it("returns false is the article is more than 2 days old", () => {
    // arrange
    const threeDaysAgoArticle = createTestArticlePublishedThreeDaysAgo({
      today,
    });
    const isRecentArticle = createIsRecentArticle(today);

    // act & assert
    expect(isRecentArticle(threeDaysAgoArticle)).toBe(false);
  });
});
