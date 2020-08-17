import { generateSitemapXML } from "./generate-sitemap-xml";
import { createIsRecentArticle } from "./is-recent-article";

export const createRecentArticlesSitemap = ({
  today,
  domain,
  language,
  articles,
}) => {
  const isRecentArticle = createIsRecentArticle(today);

  return async () =>
    generateSitemapXML({
      language,
      articles: articles.filter(isRecentArticle),
    });
};
