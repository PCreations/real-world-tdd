import { createTestServer } from "./test-server";
import {
  createGraphQLLatestArticlesRepository,
  GraphQLError,
} from "../../graphql";
import { createTestArticlePublishedOneDayAgo } from "../../../../__tests__/data/create-test-article";

describe("createGraphQLGetLatestArticle", () => {
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
    const graphQLGetLatestArticlesRepository = createGraphQLLatestArticlesRepository(
      { graphQLEndpoint }
    );
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
    await graphQLGetLatestArticlesRepository.getLatestArticles({ domain });

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
    const graphQLGetLatestArticlesRepository = createGraphQLLatestArticlesRepository(
      { graphQLEndpoint }
    );
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
    const articles = await graphQLGetLatestArticlesRepository.getLatestArticles(
      {
        domain,
      }
    );

    // assert
    expect(articles).toEqual(expectedArticles);
  });

  it("fails with a GraphQLError if there are graphQL errors in the response", async () => {
    // arrange
    expect.assertions(1);
    const domain = "www.my-website.co.uk";
    const graphQLEndpoint = "http://localhost:4123";
    const graphQLGetLatestArticlesRepository = createGraphQLLatestArticlesRepository(
      { graphQLEndpoint }
    );
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
      graphQLGetLatestArticlesRepository.getLatestArticles({ domain })
    ).rejects.toEqual(new GraphQLError(expectedErrors));
  });
});
