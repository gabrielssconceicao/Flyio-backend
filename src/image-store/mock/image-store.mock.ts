export const imageStoreServiceMock = () => {
  return {
    uploadUserImage: jest.fn(),
    updateUserImage: jest.fn(),
    deleteUserImage: jest.fn(),
  };
};
