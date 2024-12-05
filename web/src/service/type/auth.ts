export type User = {
  id: string;
  name: string;
};

export type Auth = {
  token: string;
  user: User;
};
