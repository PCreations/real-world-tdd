import { createRecentArticlesSitemap } from "./recent-articles-sitemap";

export const createHandler = ({ domains }) => {
  const recentArticlesSitemap = createRecentArticlesSitemap({
    todayDate: new Date(),
  });

  return () =>
    Promise.all(
      domains.map(({ domain, language }) =>
        recentArticlesSitemap({ domain, language })
      )
    );
};
