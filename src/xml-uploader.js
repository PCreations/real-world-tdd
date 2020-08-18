import AWS from "aws-sdk";

export class XMLUploadError extends Error {
  constructor(message) {
    super();
    this.message = `Error while uploading XML file : ${message}`;
  }
}

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const buildKey = (domain) => `${domain}/sitemap.xml`;

export const createXMLUploader = ({ s3 = new AWS.S3() } = {}) => {
  const sentXML = {};
  return {
    async upload({ domain, xml }) {
      try {
        await s3
          .putObject({
            Bucket: process.env.S3_BUCKET,
            Key: buildKey(domain),
            Body: xml,
            ContentType: "application/xml",
          })
          .promise();
      } catch (error) {
        throw new XMLUploadError(error.message);
      }
      sentXML[buildKey(domain)] = xml;
    },
    getLastSentXML(domain) {
      return sentXML[buildKey(domain)];
    },
  };
};

const createFakeS3 = ({ uploadErrorMessage = null } = {}) => ({
  putObject() {
    return {
      promise() {
        return uploadErrorMessage
          ? Promise.reject(new Error(uploadErrorMessage))
          : Promise.resolve();
      },
    };
  },
});

export const createFakeXMLUploader = () =>
  createXMLUploader({ s3: createFakeS3() });

export const createXMLUploaderThatWillFail = (uploadErrorMessage) =>
  createXMLUploader({ s3: createFakeS3({ uploadErrorMessage }) });
