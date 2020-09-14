import aws from "aws-sdk";

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

export const createS3UploadSitemap = () => ({ filename, xml }) =>
  new aws.S3()
    .putObject({
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Body: xml,
      ContentType: "application/xml",
    })
    .promise();
