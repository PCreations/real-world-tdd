import { createTestServer } from "./test-server";
import { executeLatestArticlesQuery } from "../execute-latest-articles-query";
import { createTestArticlePublishedOneDayAgo } from "./data/create-test-article";

describe("executeLatestArticlesQuery", () => {
  let testServer;
  beforeAll((done) => {
    testServer = createTestServer({ port: 4123 });
    testServer.listen(done);
  });
  afterAll((done) => {
    testServer.close(done);
  });
  it("executes the correct request", async () => {
    // arrange
    expect.assertions(3);
    const domain = "www.my-website.co.uk";
    const graphQLEndpoint = "http://localhost:4123";
    const expectedGraphQLQuery = `
  query {
    latestArticles {
      publicationDate
      title
      url
    }
  }
`;
    testServer.setResponse({
      status: 200,
      body: {
        data: {
          latestArticles: [],
        },
      },
    });

    // act
    await executeLatestArticlesQuery({ domain, graphQLEndpoint });

    // assert
    const lastSentRequest = testServer.getLastSentRequest();
    expect(lastSentRequest.body).toEqual({
      query: expectedGraphQLQuery,
    });
    expect(lastSentRequest.headers.domain).toEqual(domain);
    expect(lastSentRequest.headers["content-type"]).toEqual("application/json");
  });

  it("get the latest articles from the graphQL response", async () => {
    // arrange
    expect.assertions(1);
    const domain = "www.my-website.co.uk";
    const graphQLEndpoint = "http://localhost:4123";
    const expectedArticles = [
      createTestArticlePublishedOneDayAgo(),
      createTestArticlePublishedOneDayAgo(),
      createTestArticlePublishedOneDayAgo(),
    ];
    testServer.setResponse({
      status: 200,
      body: {
        data: {
          latestArticles: expectedArticles,
        },
      },
    });

    // act
    const articles = await executeLatestArticlesQuery({
      domain,
      graphQLEndpoint,
    });

    // assert
    expect(articles).toEqual(expectedArticles);
  });
});
