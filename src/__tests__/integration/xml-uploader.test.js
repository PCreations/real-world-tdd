import { createXMLUploader } from "../../xml-uploader";

describe("xmlUploader", () => {
  it("uploads the xml to an s3 bucket", async () => {
    // arrange
    const domain = "www.some-url.com";
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <loc>www.some-url.com/article-1</loc>
  <news:news>
    <news:publication>
      <news:name>My Website</news:name>
      <news:language>en-GB</news:language>
    </news:publication>
    <news:publication_date>2020-08-17T13:55:19.991Z</news:publication_date>
    <news:title>article title</news:title>
  </news:news>
</urlset>`;
    const xmlUploader = createXMLUploader();

    // act & assert
    await xmlUploader.upload({ domain, xml });
  });
});
