export const createArticleToXML = (language) => ({
  publicationDate,
  url,
  title,
}) => `<url>
  <loc>${url}</loc>
  <news:news>
    <news:publication>
      <news:name>My Website</news:name>
      <news:language>${language}</news:language>
    </news:publication>
    <news:publication_date>${publicationDate}</news:publication_date>
    <news:title>${title}</news:title>
  </news:news>
</url>`;
