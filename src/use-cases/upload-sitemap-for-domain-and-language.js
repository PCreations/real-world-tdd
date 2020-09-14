import { isRecent } from "../core/is-recent";
import { articleToXml } from "../core/article-to-xml";
import { sitemapNameForDomain } from "../core/sitemap-name-for-domain";

export const uploadSitemapForDomainAndLanguage = async ({
  todayDate,
  domain,
  language,
  getLatestArticles,
  uploadSitemap,
}) => {
  const articles = await getLatestArticles({ domain });
  const recentArticles = articles.filter(({ publicationDate }) => {
    return isRecent({ todayDate, publicationDate: new Date(publicationDate) });
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${recentArticles
    .map((article) => articleToXml({ language, article }))
    .join("")}</urlset>`;

  return uploadSitemap({ filename: sitemapNameForDomain({ domain }), xml });
};
