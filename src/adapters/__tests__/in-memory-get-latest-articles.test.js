const {
  createTestArticlePublishedOneDayAgo,
} = require("../../__tests__/data/create-test-article");
const {
  createInMemoryGetLatestArticles,
} = require("../in-memory-get-latest-articles");

describe("createInMemoryGetLatestArticles", () => {
  it("should be created with default articles for specific domain", async () => {
    const articlesByDomain = {
      domainA: [
        createTestArticlePublishedOneDayAgo(),
        createTestArticlePublishedOneDayAgo(),
        createTestArticlePublishedOneDayAgo(),
      ],
      domainB: [
        createTestArticlePublishedOneDayAgo(),
        createTestArticlePublishedOneDayAgo(),
        createTestArticlePublishedOneDayAgo(),
      ],
    };
    const getLatestArticles = createInMemoryGetLatestArticles({
      articlesByDomain,
    });

    await expect(getLatestArticles({ domain: "domainA" })).resolves.toEqual(
      articlesByDomain.domainA
    );
    await expect(getLatestArticles({ domain: "domainB" })).resolves.toEqual(
      articlesByDomain.domainB
    );
  });
});
