import { createTestArticle } from "./test-data/create-test-article";
import { createArticleToXML } from "../article-to-xml";

describe("articleToXml", () => {
  it("converts an article to xml", () => {
    // arrange
    const language = "en-GB";
    const article = createTestArticle();
    const articleToXML = createArticleToXML(language);

    // act
    const xml = articleToXML(article);

    // assert
    expect(xml).toEqual(`<url>
  <loc>${article.url}</loc>
  <news:news>
    <news:publication>
      <news:name>My Website</news:name>
      <news:language>${language}</news:language>
    </news:publication>
    <news:publication_date>${article.publicationDate}</news:publication_date>
    <news:title>${article.title}</news:title>
  </news:news>
</url>`);
  });
});
