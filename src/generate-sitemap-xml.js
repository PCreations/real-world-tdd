import { createArticleToXML } from "./article-to-xml";

export const generateSitemapXML = ({ language, articles }) => {
  const articleToXML = createArticleToXML(language);

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articles
    .map(articleToXML)
    .join("")}</urlset>`;
};
