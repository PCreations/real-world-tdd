import axios from "axios";

export class GraphQLError extends Error {
  constructor(graphQLErrors = []) {
    super();
    this.message = `GraphQL errors : ${graphQLErrors
      .map(({ message }) => message)
      .join("\n")}`;
  }
}

const LatestArticlesQuery = `
  query {
    latestArticles {
      publicationDate
      title
      url
    }
  }
`;

export const createGraphQLGetLatestArticle = ({ graphQLEndpoint }) => ({
  domain,
}) =>
  axios({
    url: graphQLEndpoint,
    method: "POST",
    data: {
      query: LatestArticlesQuery,
    },
    headers: {
      "content-type": "application/json",
      domain,
    },
  })
    .then((response) => response.data.data.latestArticles)
    .catch((error) => {
      throw new GraphQLError(error.response.data.errors);
    });
