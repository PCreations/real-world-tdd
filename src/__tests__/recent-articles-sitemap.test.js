import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "./create-test-article";
import { createRecentArticlesSitemap } from "../recent-articles-sitemap";
import { generateSitemapXML } from "../generate-sitemap-xml";
import { createFakeExecuteLatestArticlesQuery } from "../execute-latest-articles-query";

describe("recentArticlesSitemap", () => {
  it("generates the sitemap xml of the latest articles for a specific domain and language", async () => {
    // arrange
    const today = new Date("2020-08-17T13:55:19.991Z");
    const articles = [
      createTestArticlePublishedOneDayAgo(today),
      createTestArticlePublishedTwoDaysAgo(today),
      createTestArticlePublishedThreeDaysAgo(today),
    ];
    const domain = "wwww.my-website.co-uk";
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      domain,
      articles,
    });
    const expectedArticles = articles.slice(0, 2);
    const language = "en-GB";
    const recentArticlesSitemap = createRecentArticlesSitemap({
      today,
      domain,
      executeLatestArticlesQuery,
      language,
    });

    // act
    const xml = await recentArticlesSitemap();

    // assert
    expect(xml).toEqual(
      generateSitemapXML({ language, articles: expectedArticles })
    );
  });
});
