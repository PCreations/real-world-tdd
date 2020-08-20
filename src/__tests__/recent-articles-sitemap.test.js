import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "./test-data/create-test-article";
import { createRecentArticlesSitemap } from "../recent-articles-sitemap";
import { generateSitemapXML } from "../generate-sitemap-xml";
import { mockedXMLUploader } from "./mocks/xml-uploader";
import { createLatestArticlesQuery } from "../latest-articles-query";
import { mockedSendLatestArticlesQueryWithResponses } from "./mocks/send-latest-articles-query";

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
    const {
      sendLatestArticlesQuery,
    } = mockedSendLatestArticlesQueryWithResponses([
      {
        articles: firstPageArticles,
        pageInfo: {
          hasNextPage: true,
          endCursor: "some-end-cursor",
        },
      },
      {
        articles: secondPageArticles,
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      },
    ]);

    const expectedFirstQuery = createLatestArticlesQuery({ domain });
    const expectedSecondQuery = createLatestArticlesQuery({
      domain,
      after: "some-end-cursor",
    });
    const spy = { sendLatestArticlesQuery };
    jest.spyOn(spy, "sendLatestArticlesQuery");
    const { xmlUploader, expectToHavePutFile } = mockedXMLUploader();
    const expectedArticles = firstPageArticles.concat(
      secondPageArticles.slice(0, 2)
    );
    const language = "en-GB";
    const recentArticlesSitemap = createRecentArticlesSitemap({
      today,
      domain,
      sendLatestArticlesQuery: spy.sendLatestArticlesQuery,
      xmlUploader,
      language,
    });

    // act
    await recentArticlesSitemap();

    // assert
    expect(spy.sendLatestArticlesQuery).toHaveBeenNthCalledWith(
      1,
      expectedFirstQuery
    );
    expect(spy.sendLatestArticlesQuery).toHaveBeenNthCalledWith(
      2,
      expectedSecondQuery
    );
    expectToHavePutFile({
      xml: generateSitemapXML({ language, articles: expectedArticles }),
      domain,
    });
  });
});
