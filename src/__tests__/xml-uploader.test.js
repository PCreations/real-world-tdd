import { createXMLUploader } from "../xml-uploader";

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

    // act
    await xmlUploader.upload({ domain, xml });

    // assert
    expect(xmlUploader.getLastSentXML(domain)).toEqual(xml);
  });
  it("can be faked", async () => {
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
    const xmlUploader = createFakeXMLUploader();

    // act
    await xmlUploader.upload({ domain, xml });

    // assert
    expect(xmlUploader.getLastSentXML(domain)).toEqual(xml);
  });

  it("throws an XMLUploadError if the upload fails", async () => {
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
    const xmlUploader = createXMLUploaderThatWillFail("some error message");

    // act & assert
    await expect(xmlUploader.upload({ domain, xml })).rejects.toEqual(
      new XMLUploadError("some error message")
    );
  });
});
