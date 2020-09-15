import { createHandler } from "./handler";
import { domains } from "./core/constants/domains";
import { createGraphQLLatestArticlesRepository } from "./adapters/latest-articles-repository";
import { createS3XMLUploader } from "./adapters/xml-uploader";

export const handler = createHandler({
  domains,
  todayDate: new Date(),
  latestArticlesRepository: createGraphQLLatestArticlesRepository({
    graphQLEndpoint: process.env.GRAPHQL_ENDPOINT,
  }),
  xmlUploader: createS3XMLUploader(),
});
