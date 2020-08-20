import { generateSitemapXML } from "./generate-sitemap-xml";
import { createSendLatestArticlesQuery } from "./send-latest-articles-query";
import { createXMLUploader } from "./xml-uploader";
import {
  handleLatestArticleQueryResponse,
  createLatestArticlesQuery,
} from "./latest-articles-query";

export const createRecentArticlesSitemap = ({
  today,
  domain,
  sendLatestArticlesQuery = createSendLatestArticlesQuery(),
  xmlUploader = createXMLUploader(),
  language,
}) => {
  let articles = [];

  return async () => {
    let after = null;

    do {
      /* eslint-disable no-await-in-loop */
      const query = createLatestArticlesQuery({ domain, after });
      const graphQLResponse = await sendLatestArticlesQuery(query);
      const response = handleLatestArticleQueryResponse({
        today,
        graphQLResponse,
      });
      articles = articles.concat(response.getArticles());
      after = response.getAfter();
    } while (after !== null);

    await xmlUploader.upload({
      domain,
      xml: generateSitemapXML({
        language,
        articles,
      }),
    });
  };
};
