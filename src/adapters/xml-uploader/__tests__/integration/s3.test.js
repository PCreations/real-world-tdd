import { createS3XMLUploader } from "../../s3";
import {
  mockPromise,
  mockPutObject,
  mockConfigUpdate,
} from "../../../../../__mocks__/aws-sdk";

describe("createS3UploadSitemap", () => {
  it("correctly puts the xml to the s3 bucket", async () => {
    // arrange
    const filename = `test-${+new Date()}/sitemap.xml`;
    const xmlUploader = createS3XMLUploader();
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?><hello><to>Test</to></hello>';

    // act & assert
    await expect(
      xmlUploader.upload({
        filename,
        xml,
      })
    ).resolves.not.toThrow();
    expect(mockPromise).toHaveBeenCalled();
    expect(mockConfigUpdate).toHaveBeenCalledWith({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.REGION,
    });
    expect(mockPutObject).toHaveBeenCalledWith({
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Body: xml,
      ContentType: "application/xml",
    });
  });
});
