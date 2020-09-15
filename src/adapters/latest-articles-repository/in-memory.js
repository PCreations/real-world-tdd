export const createInMemoryLatestArticlesRepository = ({
  articlesByDomain,
}) => {
  return {
    getLatestArticles({ domain }) {
      return Promise.resolve(articlesByDomain[domain]);
    },
  };
};
