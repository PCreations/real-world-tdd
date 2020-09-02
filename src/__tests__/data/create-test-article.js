import faker from "faker";

const ONE_DAY_IN_MS = 3600 * 24 * 1000;

export const createTestArticle = ({
  publicationDate = new Date(),
  title = faker.lorem.words(3),
  url = faker.internet.url(),
} = {}) => ({
  publicationDate: publicationDate.toISOString(),
  title,
  url,
});

const createTestArticlePublishedXDaysAgo = (daysAgo) => ({
  today = new Date(),
  ...articleFields
} = {}) =>
  createTestArticle({
    publicationDate: new Date(+today - daysAgo * ONE_DAY_IN_MS),
    ...articleFields,
  });

export const createTestArticlePublishedOneDayAgo = createTestArticlePublishedXDaysAgo(
  1
);

export const createTestArticlePublishedTwoDaysAgo = createTestArticlePublishedXDaysAgo(
  2
);

export const createTestArticlePublishedThreeDaysAgo = createTestArticlePublishedXDaysAgo(
  3
);
