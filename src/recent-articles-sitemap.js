import { generateSitemapXML } from "./generate-sitemap-xml";
import { createIsRecentArticle } from "./is-recent-article";
import { createExecuteLatestArticlesQuery } from "./execute-latest-articles-query";

export const createRecentArticlesSitemap = ({
  today,
  domain,
  executeLatestArticlesQuery = createExecuteLatestArticlesQuery(),
  language,
}) => {
  const isRecentArticle = createIsRecentArticle(today);

  return async () => {
    const response = await executeLatestArticlesQuery({ domain });
    return generateSitemapXML({
      language,
      articles: response.getArticles().filter(isRecentArticle),
    });
  };
};
