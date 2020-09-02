import { createTestServer } from "./test-server";
import { executeLatestArticlesQuery } from "../execute-latest-articles-query";

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
});
