import { createInMemoryGetLatestArticles } from "../../adapters/in-memory-get-latest-articles";
import { sitemapNameForDomain } from "../../core/sitemap-name-for-domain";
import { uploadSitemapForDomainAndLanguage } from "../upload-sitemap-for-domain-and-language";
import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "../../__tests__/data/create-test-article";

describe("uploadSitemapForDomainAndLanguage", () => {
  it("uploads the correct xml sitemap for a specific domain and language", async () => {
    const domain = "www.my-website.co.uk";
    const language = "en-GB";
    const today = new Date();
    const articlesByDomain = {
      [domain]: [
        createTestArticlePublishedOneDayAgo({ today }),
        createTestArticlePublishedTwoDaysAgo({ today }),
        createTestArticlePublishedThreeDaysAgo({ today }),
      ],
    };
    const getLatestArticles = createInMemoryGetLatestArticles({
      articlesByDomain,
    });
    const uploadSitemap = jest.fn();

    await uploadSitemapForDomainAndLanguage({
      todayDate: today,
      domain,
      language,
      getLatestArticles,
      uploadSitemap,
    });

    expect(uploadSitemap).toHaveBeenCalledWith({
      filename: sitemapNameForDomain({ domain }),
      xml: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articlesByDomain[
        domain
      ]
        .slice(0, 2)
        .map(
          (article) =>
            `<url><loc>${article.url}</loc><news:news><news:publication><news:name>My Website</news:name><news:language>${language}</news:language></news:publication><news:publication_date>${article.publicationDate}</news:publication_date><news:title>${article.title}</news:title></news:news></url>`
        )
        .join("")}</urlset>`,
    });
  });
});
