import { createRecentArticlesSitemap } from "../recent-articles-sitemap";
import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "./data/create-test-article";
import { articleToXml } from "../article-to-xml";

describe("recentArticlesSitemap", () => {
  it("generates the sitemap xml of the latest articles for a specific domain and language", async () => {
    // arrange
    const today = new Date("2020-09-01T12:07:23.997Z");
    const articles = [
      createTestArticlePublishedOneDayAgo({ today }),
      createTestArticlePublishedTwoDaysAgo({ today }),
      createTestArticlePublishedThreeDaysAgo({ today }),
    ];
    const domain = "wwww.my-website.co-uk";
    const language = "en-GB";
    const recentArticlesSitemap = createRecentArticlesSitemap({
      todayDate: today,
      articles,
    });

    // act
    const xml = await recentArticlesSitemap({ domain, language });

    // assert
    expect(xml).toEqual(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articles
        .slice(0, 2)
        .map((article) => articleToXml({ language, article }))
        .join("")}</urlset>`
    );
  });
});
