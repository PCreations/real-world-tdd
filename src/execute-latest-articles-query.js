import axios from "axios";

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
  }).then((response) => response.data.data.latestArticles);
