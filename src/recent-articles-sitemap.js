import { createIsRecentArticle } from "./is-recent-article";
import { articleToXml } from "./article-to-xml";
import { createExecuteLatestArticlesQuery } from "./execute-latest-articles-query";
import { createS3xmlUploader } from "./s3-xml-uploader";

export const createRecentArticlesSitemap = ({
  todayDate,
  executeLatestArticlesQuery = createExecuteLatestArticlesQuery(),
  s3xmlUploader = createS3xmlUploader({ bucketName: process.env.S3_BUCKET }),
}) => {
  const isRecentArticle = createIsRecentArticle(todayDate);
  return async ({ domain, language }) => {
    const articles = await executeLatestArticlesQuery({
      domain,
      graphQLEndpoint: process.env.GRAPHQL_ENDPOINT,
    });
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articles
      .filter(isRecentArticle)
      .map((article) => articleToXml({ language, article }))
      .join("")}</urlset>`;

    return s3xmlUploader.upload({ domain, xmlString });
  };
};
