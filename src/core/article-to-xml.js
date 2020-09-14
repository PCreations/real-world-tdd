export const articleToXml = ({ language, article }) =>
  `<url><loc>${article.url}</loc><news:news><news:publication><news:name>My Website</news:name><news:language>${language}</news:language></news:publication><news:publication_date>${article.publicationDate}</news:publication_date><news:title>${article.title}</news:title></news:news></url>`;
