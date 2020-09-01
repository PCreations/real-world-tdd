import { createIsRecentArticle } from "./is-recent-article";

export const createRecentArticlesSitemap = ({ todayDate, articles }) => {
  const isRecentArticle = createIsRecentArticle(todayDate);
  return async ({ domain, language }) =>
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articles
      .filter(isRecentArticle)
      .map(
        (article) =>
          `<url><loc>${article.url}</loc><news:news><news:publication><news:name>My Website</news:name><news:language>${language}</news:language></news:publication><news:publication_date>${article.publicationDate}</news:publication_date><news:title>${article.title}</news:title></news:news></url>`
      )
      .join("")}</urlset>`;
};
