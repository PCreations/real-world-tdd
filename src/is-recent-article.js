const ONE_DAY_IN_MS = 3600 * 24 * 1000;

export const createIsRecentArticle = (today) => {
  const twoDaysAgo = new Date(+today - ONE_DAY_IN_MS * 2);
  return ({ publicationDate }) =>
    new Date(publicationDate).getTime() >= twoDaysAgo.getTime();
};
