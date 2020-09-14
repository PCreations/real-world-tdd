const ONE_DAY_IN_MS = 3600 * 24 * 1000;
const CONSIDERED_OLD_AFTER_X_DAYS = 2;

export const isRecent = ({ todayDate, publicationDate }) =>
  +todayDate - publicationDate <= ONE_DAY_IN_MS * CONSIDERED_OLD_AFTER_X_DAYS;
