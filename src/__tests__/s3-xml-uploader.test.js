import { createFakeS3xmlUploader } from "../s3-xml-uploader";

describe("s3xmlUploader", () => {
  it("can be nullable", async () => {
    // arrange
    const xmlUploader = createFakeS3xmlUploader({ bucketName: "test-bucket" });
    const xmlString =
      '<?xml version="1.0" encoding="UTF-8"?><hello><to>Test</to></hello>';
    const domain = "www.my-website.co.uk";

    // act
    await xmlUploader.upload({ domain, xmlString });

    // assert
    expect(xmlUploader.getLastPutObject()).toEqual({
      Bucket: "test-bucket",
      Key: "www.my-website.co.uk/sitemap.xml",
      Body: xmlString,
      ContentType: "application/xml",
    });
  });
});
