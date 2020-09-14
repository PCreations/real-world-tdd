import { sitemapNameForDomain } from "../sitemap-name-for-domain";

describe("sitemapNameFromDomain", () => {
  it("uses the domain to generate the good file path", () => {
    expect(sitemapNameForDomain({ domain: "www.domain.com" })).toEqual(
      "www.domain.com/sitemaps/recentNews.xml"
    );
  });
});
