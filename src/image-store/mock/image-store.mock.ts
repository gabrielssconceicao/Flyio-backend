export const imageStoreServiceMock = () => {
  return {
    uploadUserImage: jest.fn(),
    updateUserImage: jest.fn(),
    deleteImage: jest.fn(),
  };
};
