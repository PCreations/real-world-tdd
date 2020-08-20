import { createIsRecentArticle } from "../is-recent-article";
import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "./test-data/create-test-article";

describe("is-recent-article", () => {
  it("returns true if the article is less than 2 days old", () => {
    // arrange
    const today = new Date("2020-08-17T13:55:19.991Z");
    const oneDayAgoArticle = createTestArticlePublishedOneDayAgo(today);
    const twoDaysAgoArticle = createTestArticlePublishedTwoDaysAgo(today);
    const isRecentArticle = createIsRecentArticle(today);

    // act & assert
    expect(isRecentArticle(oneDayAgoArticle)).toBe(true);
    expect(isRecentArticle(twoDaysAgoArticle)).toBe(true);
  });

  it("returns false if the article is older than 2 days", () => {
    // arrange
    const today = new Date("2020-08-17T13:55:19.991Z");
    const threeDaysAgoArticle = createTestArticlePublishedThreeDaysAgo(today);
    const isRecentArticle = createIsRecentArticle(today);

    // act & assert
    expect(isRecentArticle(threeDaysAgoArticle)).toBe(false);
  });
});
