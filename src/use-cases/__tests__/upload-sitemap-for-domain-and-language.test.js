import { createInMemoryLatestArticlesRepository } from "../../adapters/latest-articles-repository";
import { createInMemoryXMLUploader } from "../../adapters/xml-uploader";
import { sitemapNameForDomain } from "../../core/sitemap-name-for-domain";
import { uploadSitemapForDomainAndLanguage } from "../upload-sitemap-for-domain-and-language";
import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "../../__tests__/data/create-test-article";
import { xmlSitemap } from "../../core/xml-sitemap";

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
    const latestArticlesRepository = createInMemoryLatestArticlesRepository({
      articlesByDomain,
    });
    const xmlUploader = createInMemoryXMLUploader();

    await uploadSitemapForDomainAndLanguage({
      todayDate: today,
      domain,
      language,
      latestArticlesRepository,
      xmlUploader,
    });

    expect(
      xmlUploader.getSentXmlForFilename({
        filename: sitemapNameForDomain({ domain }),
      })
    ).toEqual(
      xmlSitemap({ language, articles: articlesByDomain[domain].slice(0, 2) })
    );
  });
});
