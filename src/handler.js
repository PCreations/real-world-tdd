import { createGraphQLGetLatestArticle } from "./adapters/graphql-get-latest-articles";
import { createS3UploadSitemap } from "./adapters/s3-upload-sitemap";
import { uploadSitemapForDomainAndLanguage } from "./use-cases/upload-sitemap-for-domain-and-language";

export const createHandler = ({ domains, todayDate }) => {
  const getLatestArticles = createGraphQLGetLatestArticle({
    graphQLEndpoint: process.env.GRAPHQL_ENDPOINT,
  });
  const uploadSitemap = createS3UploadSitemap();

  return async () =>
    Promise.all(
      domains.map(({ domain, language }) =>
        uploadSitemapForDomainAndLanguage({
          todayDate,
          domain,
          getLatestArticles,
          language,
          uploadSitemap,
        })
      )
    );
};
