import { createHandler } from "../handler";
import { createInMemoryLatestArticlesRepository } from "../adapters/latest-articles-repository";
import { createTestArticlePublishedOneDayAgo } from "./data/create-test-article";
import { createInMemoryXMLUploader } from "../adapters/xml-uploader";
import { sitemapNameForDomain } from "../core/sitemap-name-for-domain";
import { xmlSitemap } from "../core/xml-sitemap";

describe("createHandler", () => {
  it("correctly sends the xml sitemaps", async () => {
    const domains = [
      {
        domain: "www.my-website.co.uk",
        language: "en-GB",
      },
      {
        domain: "www.my-website.fr",
        language: "fr-FR",
      },
    ];
    const articlesByDomain = {
      [domains[0].domain]: [
        createTestArticlePublishedOneDayAgo(),
        createTestArticlePublishedOneDayAgo(),
        createTestArticlePublishedOneDayAgo(),
      ],
      [domains[1].domain]: [
        createTestArticlePublishedOneDayAgo(),
        createTestArticlePublishedOneDayAgo(),
        createTestArticlePublishedOneDayAgo(),
      ],
    };
    const todayDate = new Date();
    const latestArticlesRepository = createInMemoryLatestArticlesRepository({
      articlesByDomain,
    });
    const xmlUploader = createInMemoryXMLUploader();
    const handler = createHandler({
      domains,
      todayDate,
      latestArticlesRepository,
      xmlUploader,
    });

    await handler();

    expect(
      xmlUploader.getSentXmlForFilename({
        filename: sitemapNameForDomain({ domain: domains[0].domain }),
      })
    ).toEqual(
      xmlSitemap({
        language: domains[0].language,
        articles: articlesByDomain[domains[0].domain],
      })
    );
    expect(
      xmlUploader.getSentXmlForFilename({
        filename: sitemapNameForDomain({ domain: domains[1].domain }),
      })
    ).toEqual(
      xmlSitemap({
        language: domains[1].language,
        articles: articlesByDomain[domains[1].domain],
      })
    );
  });
});
