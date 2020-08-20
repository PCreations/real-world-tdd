import {
  createSendLatestArticlesQuery,
  GraphQLError,
  RequestTimeoutError,
} from "../send-latest-articles-query";
import { createLatestArticlesQuery } from "../latest-articles-query";
import { mockedSendLatestArticlesQueryWithResponses } from "./mocks/send-latest-articles-query";

describe("sendLatestArticlesQuery", () => {
  it("returns the response", async () => {
    // arrange
    expect.assertions(2);
    const expectedDefaultTimeout = 10000;
    const domain = "wwww.my-website.co-uk";
    const {
      sendLatestArticlesQuery,
      expectToHaveSentQuery,
    } = mockedSendLatestArticlesQueryWithResponses();
    const { graphQLQuery, variables, headers } = createLatestArticlesQuery({
      domain,
    });

    // act
    const response = await sendLatestArticlesQuery({
      graphQLQuery,
      variables,
      headers,
    });

    // assert
    expect(response.data.latestArticles).toBeDefined();
    expectToHaveSentQuery({
      method: "POST",
      url: process.env.GRAPHQL_API_ENDPOINT,
      data: {
        query: graphQLQuery,
        variables,
      },
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      timeout: expectedDefaultTimeout,
    });
  });

  it("fails with a GraphQLError if the response contains graphql errors", async () => {
    // arrange
    expect.assertions(1);
    const graphQLErrors = [
      {
        message: "some error message",
      },
      {
        message: "some other error message",
      },
    ];
    const response = {
      data: {
        errors: graphQLErrors,
      },
      status: 400,
    };
    const error = new Error();
    error.response = response;
    const sendQuery = jest.fn().mockRejectedValueOnce(error);
    const sendLatestArticlesQuery = createSendLatestArticlesQuery({
      sendQuery,
    });

    // act & assert
    await expect(sendLatestArticlesQuery()).rejects.toEqual(
      new GraphQLError([
        {
          message: "some error message",
        },
        {
          message: "some other error message",
        },
      ])
    );
  });

  it("fails with a RequestTimeoutError if the request times out", async () => {
    // arrange
    expect.assertions(1);
    const response = {
      status: 408,
    };
    const error = new Error();
    error.response = response;
    const sendQuery = jest.fn().mockRejectedValueOnce(error);
    const sendLatestArticlesQuery = createSendLatestArticlesQuery({
      sendQuery,
    });

    // act & assert
    await expect(sendLatestArticlesQuery()).rejects.toEqual(
      new RequestTimeoutError()
    );
  });
});
