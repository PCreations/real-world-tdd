import { createS3xmlUploader } from "../../s3-xml-uploader";

describe("s3xmlUploader", () => {
  it("uploads the xml to the S3 bucket", async () => {
    // arrange
    const xmlUploader = createS3xmlUploader({
      bucketName: process.env.S3_BUCKET,
    });
    const xmlString =
      '<?xml version="1.0" encoding="UTF-8"?><hello><to>Test</to></hello>';
    const domain = "www.my-website.co.uk";

    // act & assert
    await expect(
      xmlUploader.upload({
        domain,
        xmlString,
      })
    ).resolves.not.toThrow();
    expect(xmlUploader.getLastPutObject()).toEqual({
      Bucket: process.env.S3_BUCKET,
      Key: "www.my-website.co.uk/sitemap.xml",
      Body: xmlString,
      ContentType: "application/xml",
    });
  });
});
