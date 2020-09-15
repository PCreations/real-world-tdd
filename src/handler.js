import { uploadSitemapForDomainAndLanguage } from "./use-cases/upload-sitemap-for-domain-and-language";

export const createHandler = ({
  domains,
  todayDate,
  latestArticlesRepository,
  xmlUploader,
}) => {
  return async () =>
    Promise.all(
      domains.map(({ domain, language }) =>
        uploadSitemapForDomainAndLanguage({
          todayDate,
          domain,
          latestArticlesRepository,
          language,
          xmlUploader,
        })
      )
    );
};
