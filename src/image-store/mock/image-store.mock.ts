export const imageStoreServiceMock = () => {
  return {
    uploadProfileImage: jest.fn(),
    updateProfileImage: jest.fn(),
    deleteProfileImage: jest.fn(),
  };
};
