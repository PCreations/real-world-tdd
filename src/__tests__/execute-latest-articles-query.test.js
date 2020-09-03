import { createTestServer } from "./test-server";
import {
  createExecuteLatestArticlesQuery,
  createFakeExecuteLatestArticlesQuery,
  GraphQLError,
} from "../execute-latest-articles-query";
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
    const executeLatestArticlesQuery = createExecuteLatestArticlesQuery();
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
    const executeLatestArticlesQuery = createExecuteLatestArticlesQuery();
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

  it("fails with a GraphQLError if there are graphQL errors in the response", async () => {
    // arrange
    expect.assertions(1);
    const executeLatestArticlesQuery = createExecuteLatestArticlesQuery();
    const domain = "www.my-website.co.uk";
    const graphQLEndpoint = "http://localhost:4123";
    const expectedErrors = [
      {
        message: "some error",
      },
      {
        message: "some other error",
      },
    ];
    testServer.setResponse({
      status: 400,
      body: {
        errors: expectedErrors,
      },
    });

    // act & assert
    await expect(
      executeLatestArticlesQuery({ domain, graphQLEndpoint })
    ).rejects.toEqual(new GraphQLError(expectedErrors));
  });

  it("response can be faked with predefined articles for a specific domain", async () => {
    // arrange
    expect.assertions(2);
    const domainA = "www.domain-a.co.uk";
    const expectedArticlesForDomainA = [
      createTestArticlePublishedOneDayAgo(),
      createTestArticlePublishedOneDayAgo(),
      createTestArticlePublishedOneDayAgo(),
    ];
    const domainB = "www.domain-b.co.uk";
    const expectedArticlesForDomainB = [
      createTestArticlePublishedOneDayAgo(),
      createTestArticlePublishedOneDayAgo(),
      createTestArticlePublishedOneDayAgo(),
    ];
    const executeLatestArticlesQuery = createFakeExecuteLatestArticlesQuery({
      [domainA]: expectedArticlesForDomainA,
      [domainB]: expectedArticlesForDomainB,
    });

    // act
    const receivedArticlesForDomainA = await executeLatestArticlesQuery({
      domain: domainA,
    });
    const receivedArticlesForDomainB = await executeLatestArticlesQuery({
      domain: domainB,
    });

    // assert
    expect(receivedArticlesForDomainA).toEqual(expectedArticlesForDomainA);
    expect(receivedArticlesForDomainB).toEqual(expectedArticlesForDomainB);
  });
});
