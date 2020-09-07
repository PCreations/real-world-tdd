import { createRecentArticlesSitemap } from "../recent-articles-sitemap";
import { createHandler } from "../handler";

jest.mock("../recent-articles-sitemap");

describe("handler", () => {
  it("delegates the creation of the sitemap for each domain/language", async () => {
    // arrange
    const domains = [
      {
        domain: "www.my-website.fr",
        language: "fr-FR",
      },
      {
        domain: "www.my-website.co.uk",
        language: "en-GB",
      },
    ];
    const recentArticlesSitemap = jest.fn();
    createRecentArticlesSitemap.mockImplementation(() => recentArticlesSitemap);
    const handler = createHandler({ domains });

    // act
    await handler();

    // assert
    expect(recentArticlesSitemap).toHaveBeenNthCalledWith(1, domains[0]);
    expect(recentArticlesSitemap).toHaveBeenNthCalledWith(2, domains[1]);
  });
});
