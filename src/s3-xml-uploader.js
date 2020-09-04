import aws from "aws-sdk";

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

export const createS3xmlUploader = ({ bucketName, s3 = new aws.S3() }) => {
  let lastPutObject;

  return {
    upload({ domain, xmlString }) {
      const objectToPut = {
        Bucket: bucketName,
        Key: `${domain}/sitemap.xml`,
        Body: xmlString,
        ContentType: "application/xml",
      };
      return s3
        .putObject(objectToPut)
        .promise()
        .then(() => {
          lastPutObject = objectToPut;
        });
    },
    getLastPutObject() {
      return lastPutObject;
    },
  };
};

const fakeS3 = () => ({
  putObject() {
    return {
      promise() {
        return Promise.resolve();
      },
    };
  },
});

export const createFakeS3xmlUploader = ({ bucketName }) =>
  createS3xmlUploader({ bucketName, s3: fakeS3() });
