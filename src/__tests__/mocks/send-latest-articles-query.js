import { createSendLatestArticlesQuery } from "../../send-latest-articles-query";

export const mockedSendLatestArticlesQueryWithResponses = (
  responses = [
    { articles: [], pageInfo: { hasNextPage: false, endCursor: "" } },
  ]
) => {
  const sendQuery = jest.fn();
  responses.forEach((response) => {
    sendQuery.mockResolvedValueOnce({
      data: {
        data: {
          latestArticles: {
            edges: response.articles.map((article) => ({ node: article })),
            pageInfo: response.pageInfo,
          },
        },
      },
    });
  });

  return {
    sendLatestArticlesQuery: createSendLatestArticlesQuery({ sendQuery }),
    expectToHaveSentQuery(query) {
      expect(sendQuery).toHaveBeenCalledWith(query);
    },
  };
};
