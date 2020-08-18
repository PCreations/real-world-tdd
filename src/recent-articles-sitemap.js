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

  return async () => {
    const response = await executeLatestArticlesQuery({ domain });
    await xmlUploader.upload({
      domain,
      xml: generateSitemapXML({
        language,
        articles: response.getArticles().filter(isRecentArticle),
      }),
    });
  };
};
