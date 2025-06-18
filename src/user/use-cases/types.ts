export type GetUserParam = {
  username: string;
};

export type Count = {
  _count: {
    followers: number;
    following: number;
  };
};
