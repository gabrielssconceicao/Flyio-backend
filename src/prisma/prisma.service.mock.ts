export const prismaServiceMock = () => {
  return {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
};
