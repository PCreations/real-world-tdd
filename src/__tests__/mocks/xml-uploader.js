import { createXMLUploader } from "../../xml-uploader";

export const mockedXMLUploader = () => {
  const s3 = {
    putObject: jest.fn(() => ({
      promise: jest.fn(),
    })),
  };

  return {
    xmlUploader: createXMLUploader({ s3 }),
    expectToHavePutFile: ({ xml, domain }) =>
      expect(s3.putObject).toHaveBeenCalledWith({
        Bucket: process.env.S3_BUCKET,
        Key: `${domain}/sitemap.xml`,
        Body: xml,
        ContentType: "application/xml",
      }),
  };
};

export const mockedXMLUploaderThatWillFail = (errorMessage) => {
  const s3 = {
    putObject: jest.fn(() => ({
      promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    })),
  };

  return {
    xmlUploader: createXMLUploader({ s3 }),
  };
};
