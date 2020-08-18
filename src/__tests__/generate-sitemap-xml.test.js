import { createTestArticle } from "./create-test-article";
import { createArticleToXML } from "../article-to-xml";
import { generateSitemapXML } from "../generate-sitemap-xml";

describe("generateSitemapXml", () => {
  it("generates the sitemap xml for the given language and articles", () => {
    // arrange
    const language = "en-GB";
    const articles = [
      createTestArticle(),
      createTestArticle(),
      createTestArticle(),
    ];
    const articleToXML = createArticleToXML(language);

    // act
    const xml = generateSitemapXML({ language, articles });

    // assert
    expect(xml).toEqual(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articles
        .map(articleToXML)
        .join("")}</urlset>`
    );
  });
});
