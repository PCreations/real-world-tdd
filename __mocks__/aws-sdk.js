export const mockPromise = jest.fn(() => Promise.resolve());
export const mockPutObject = jest.fn(() => ({
  promise: mockPromise,
}));
export const mockConfigUpdate = jest.fn();

export default {
  config: {
    update: mockConfigUpdate,
  },
  S3: function S3() {
    return {
      putObject: mockPutObject,
    };
  },
};
