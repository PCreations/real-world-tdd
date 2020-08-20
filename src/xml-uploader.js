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
    },
  };
};
