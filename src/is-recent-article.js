const TWO_DAYS_IN_MS = 3600 * 24 * 1000 * 2;

export const createIsRecentArticle = (todayDate) => ({ publicationDate }) => {
  const todayTimestamp = +todayDate;
  const publicationDateTimestamp = +new Date(publicationDate);
  return todayTimestamp - publicationDateTimestamp <= TWO_DAYS_IN_MS;
};
