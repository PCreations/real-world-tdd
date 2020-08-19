import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "./create-test-article";
import { createRecentArticlesSitemap } from "../recent-articles-sitemap";
import { generateSitemapXML } from "../generate-sitemap-xml";
import { createFakeExecuteLatestArticlesQuery } from "../execute-latest-articles-query";
import { createFakeXMLUploader } from "../xml-uploader";

describe("recentArticlesSitemap", () => {
  it("generates the sitemap xml of the latest articles for a specific domain and language", async () => {
    // arrange
    const today = new Date("2020-08-17T13:55:19.991Z");
    const firstPageArticles = [
      createTestArticlePublishedOneDayAgo(today),
      createTestArticlePublishedOneDayAgo(today),
      createTestArticlePublishedOneDayAgo(today),
    ];
    const secondPageArticles = [
      createTestArticlePublishedTwoDaysAgo(today),
      createTestArticlePublishedTwoDaysAgo(today),
      createTestArticlePublishedThreeDaysAgo(today),
    ];
    const domain = "wwww.my-website.co-uk";
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      domain,
      articlesPagesByCursor: {
        null: { articles: firstPageArticles, endCursor: "some-end-cursor" },
        "some-end-cursor": { articles: secondPageArticles },
      },
      endCursor: "some-end-cursor",
    });
    const xmlUploader = createFakeXMLUploader();
    const expectedArticles = firstPageArticles.concat(
      secondPageArticles.slice(0, 2)
    );
    const language = "en-GB";
    const recentArticlesSitemap = createRecentArticlesSitemap({
      today,
      domain,
      executeLatestArticlesQuery,
      xmlUploader,
      language,
    });

    // act
    await recentArticlesSitemap();

    // assert
    expect(xmlUploader.getLastSentXML(domain)).toEqual(
      generateSitemapXML({ language, articles: expectedArticles })
    );
  });
});
