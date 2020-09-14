import { createHandler } from "./handler";
import { domains } from "./core/constants/domains";

export const handler = createHandler({ domains, todayDate: new Date() });
