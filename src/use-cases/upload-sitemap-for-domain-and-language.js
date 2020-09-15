import { isRecent } from "../core/is-recent";
import { sitemapNameForDomain } from "../core/sitemap-name-for-domain";
import { xmlSitemap } from "../core/xml-sitemap";

export const uploadSitemapForDomainAndLanguage = async ({
  todayDate,
  domain,
  language,
  latestArticlesRepository: { getLatestArticles },
  xmlUploader: { upload },
}) => {
  const articles = await getLatestArticles({ domain });
  const recentArticles = articles.filter(({ publicationDate }) => {
    return isRecent({
      todayDate,
      publicationDate: new Date(publicationDate),
    });
  });

  const xml = xmlSitemap({ language, articles: recentArticles });

  return upload({
    filename: sitemapNameForDomain({ domain }),
    xml,
  });
};
