import { articleToXml } from "../article-to-xml";

const ONE_DAY_IN_MS = 3600 * 24 * 1000;
const today = new Date();

describe("articleToXml", () => {
  it("generates the xml string representation of an article", () => {
    // arrange
    const article = {
      publicationDate: new Date(+today - ONE_DAY_IN_MS).toISOString(),
      title: "some article title",
      url: "www.some-url.com",
    };
    const language = "en-GB";

    // act
    const xml = articleToXml({ language, article });

    // assert
    expect(xml).toEqual(
      `<url><loc>www.some-url.com</loc><news:news><news:publication><news:name>My Website</news:name><news:language>en-GB</news:language></news:publication><news:publication_date>${article.publicationDate}</news:publication_date><news:title>some article title</news:title></news:news></url>`
    );
  });
});
