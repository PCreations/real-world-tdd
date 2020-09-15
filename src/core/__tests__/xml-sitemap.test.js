import { createTestArticlePublishedOneDayAgo } from "../../__tests__/data/create-test-article";
import { articleToXml } from "../article-to-xml";
import { xmlSitemap } from "../xml-sitemap";

describe("xmlSitemap", () => {
  it("generates the correct sitemaps from articles", () => {
    const language = "en-GB";
    const articles = [
      createTestArticlePublishedOneDayAgo(),
      createTestArticlePublishedOneDayAgo(),
      createTestArticlePublishedOneDayAgo(),
    ];

    const xml = xmlSitemap({ language, articles });

    expect(xml).toEqual(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articles
        .map((article) => articleToXml({ language, article }))
        .join("")}</urlset>`
    );
  });
});
