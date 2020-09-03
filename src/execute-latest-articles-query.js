import axios from "axios";

export class GraphQLError extends Error {
  constructor(graphQLErrors = []) {
    super();
    this.message = `GraphQL errors : ${graphQLErrors
      .map(({ message }) => message)
      .join("\n")}`;
  }
}

const LATEST_ARTICLES_QUERY = `
  query {
    latestArticles {
      publicationDate
      title
      url
    }
  }
`;

export const executeLatestArticlesQuery = ({ domain, graphQLEndpoint }) =>
  axios({
    url: graphQLEndpoint,
    method: "POST",
    data: {
      query: LATEST_ARTICLES_QUERY,
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
