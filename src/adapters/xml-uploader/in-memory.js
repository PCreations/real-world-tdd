export const createInMemoryXMLUploader = () => {
  const sentXmlForFilename = {};

  return {
    upload({ filename, xml }) {
      sentXmlForFilename[filename] = xml;
      return Promise.resolve();
    },
    getSentXmlForFilename({ filename }) {
      return sentXmlForFilename[filename];
    },
  };
};
