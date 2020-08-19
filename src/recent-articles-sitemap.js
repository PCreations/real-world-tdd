import { generateSitemapXML } from "./generate-sitemap-xml";
import { createIsRecentArticle } from "./is-recent-article";
import { createExecuteLatestArticlesQuery } from "./execute-latest-articles-query";
import { createXMLUploader } from "./xml-uploader";

export const createRecentArticlesSitemap = ({
  today,
  domain,
  executeLatestArticlesQuery = createExecuteLatestArticlesQuery(),
  xmlUploader = createXMLUploader(),
  language,
}) => {
  const isRecentArticle = createIsRecentArticle(today);
  let articles = [];

  return async () => {
    let needToFetchMore = false;
    let after = null;

    do {
      /* eslint-disable no-await-in-loop */
      const response = await executeLatestArticlesQuery({ domain, after });
      articles = articles.concat(response.getArticles());
      after = response.getNextPageCursor();
      needToFetchMore =
        response.getNextPageCursor() !== null &&
        response.getArticles().every(isRecentArticle);
    } while (needToFetchMore);

    await xmlUploader.upload({
      domain,
      xml: generateSitemapXML({
        language,
        articles: articles.filter(isRecentArticle),
      }),
    });
  };
};
