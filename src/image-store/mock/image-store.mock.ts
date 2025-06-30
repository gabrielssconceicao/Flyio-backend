export const userImageStoreUseCaseMock = () => {
  return {
    uploadUserImage: jest.fn(),
    updateUserImage: jest.fn(),
    deleteUserImage: jest.fn(),
  };
};

export const postImageStoreUseCaseMock = () => {
  return {
    uploadPostImages: jest.fn(),
    deletePostImages: jest.fn(),
  };
};
