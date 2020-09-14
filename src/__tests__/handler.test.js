import * as getLatestArticles from "../adapters/graphql-get-latest-articles";
import * as uploadSitemap from "../adapters/s3-upload-sitemap";
import { uploadSitemapForDomainAndLanguage } from "../use-cases/upload-sitemap-for-domain-and-language";
import { createHandler } from "../handler";

jest.mock("../use-cases/upload-sitemap-for-domain-and-language");

describe("createHandler", () => {
  it("correctly calls the upload sitemap use case for each domain and language", async () => {
    const mockGraphQLGetLatestArticles = jest.fn().mockResolvedValue([]);
    const mockS3uploadSitemap = jest.fn();
    const createGraphQLGetLatestArticle = jest
      .spyOn(getLatestArticles, "createGraphQLGetLatestArticle")
      .mockImplementation(() => mockGraphQLGetLatestArticles);
    const createS3UploadSitemap = jest
      .spyOn(uploadSitemap, "createS3UploadSitemap")
      .mockImplementation(() => mockS3uploadSitemap);
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
    const todayDate = new Date();
    const handler = createHandler({ domains, todayDate });

    await handler();

    expect(createGraphQLGetLatestArticle).toHaveBeenCalledWith({
      graphQLEndpoint: process.env.GRAPHQL_ENDPOINT,
    });
    expect(createS3UploadSitemap).toHaveBeenCalled();
    expect(uploadSitemapForDomainAndLanguage).toHaveBeenNthCalledWith(1, {
      todayDate,
      domain: "www.my-website.co.uk",
      language: "en-GB",
      getLatestArticles: mockGraphQLGetLatestArticles,
      uploadSitemap: mockS3uploadSitemap,
    });
    expect(uploadSitemapForDomainAndLanguage).toHaveBeenNthCalledWith(2, {
      todayDate,
      domain: "www.my-website.fr",
      language: "fr-FR",
      getLatestArticles: mockGraphQLGetLatestArticles,
      uploadSitemap: mockS3uploadSitemap,
    });
  });
});
