export const createInMemoryGetLatestArticles = ({ articlesByDomain }) => ({
  domain,
}) => Promise.resolve(articlesByDomain[domain]);
