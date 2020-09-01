import { createIsRecentArticle } from "./is-recent-article";
import { articleToXml } from "./article-to-xml";

export const createRecentArticlesSitemap = ({ todayDate, articles }) => {
  const isRecentArticle = createIsRecentArticle(todayDate);
  return async ({ domain, language }) =>
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articles
      .filter(isRecentArticle)
      .map((article) => articleToXml({ language, article }))
      .join("")}</urlset>`;
};
