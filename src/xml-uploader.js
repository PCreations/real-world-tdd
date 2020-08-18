import AWS from "aws-sdk";

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
      await s3
        .putObject({
          Bucket: process.env.S3_BUCKET,
          Key: buildKey(domain),
          Body: xml,
          ContentType: "application/xml",
        })
        .promise();
      sentXML[buildKey(domain)] = xml;
    },
    getLastSentXML(domain) {
      return sentXML[buildKey(domain)];
    },
  };
};
