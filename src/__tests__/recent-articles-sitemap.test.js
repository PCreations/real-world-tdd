import {
  createTestArticlePublishedOneDayAgo,
  createTestArticlePublishedTwoDaysAgo,
  createTestArticlePublishedThreeDaysAgo,
} from "./create-test-article";
import { createRecentArticlesSitemap } from "../recent-articles-sitemap";

describe("recentArticlesSitemap", () => {
  it("generates the sitemap xml of the latest articles for a specific domain and language", async () => {
    // arrange
    const today = new Date("2020-08-17T13:55:19.991Z");
    const articles = [
      createTestArticlePublishedOneDayAgo(today),
      createTestArticlePublishedTwoDaysAgo(today),
      createTestArticlePublishedThreeDaysAgo(today),
    ];
    const domain = "wwww.my-website.co-uk";
    const language = "en-GB";
    const recentArticlesSitemap = createRecentArticlesSitemap({
      domain,
      language,
      articles,
    });

    // act
    const xml = await recentArticlesSitemap();

    // assert
    expect(xml).toEqual(`
<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\" xmlns:news=\\"http://www.google.com/schemas/sitemap-news/0.9\\">
  <url>
    <loc>${articles[0].url}</loc>
    <news:news>
      <news:publication>
        <news:name>My Website</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${articles[0].publicationDate}</news:publication_date>
      <news:title>${articles[0].title}</news:title>
    </news:news>
  </url>
  <url>
    <loc>${articles[1].url}</loc>
    <news:news>
      <news:publication>
        <news:name>My Website</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${articles[1].publicationDate}</news:publication_date>
      <news:title>${articles[1].title}</news:title>
    </news:news>
  </url>
</urlset>
`);
  });
});
