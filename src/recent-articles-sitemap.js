export const createRecentArticlesSitemap = ({
  domain,
  language,
  articles,
}) => async () => `
<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\" xmlns:news=\\"http://www.google.com/schemas/sitemap-news/0.9\\">
  <url>
    <loc>${articles[0].url}</loc>
    <news:news>
      <news:publication>
        <news:name>My Website</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${articles[0].publicationDate}</news:publication_date>
      <news:title>${articles[0].title}</news:title>
    </news:news>
  </url>
  <url>
    <loc>${articles[1].url}</loc>
    <news:news>
      <news:publication>
        <news:name>My Website</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${articles[1].publicationDate}</news:publication_date>
      <news:title>${articles[1].title}</news:title>
    </news:news>
  </url>
</urlset>
`;
