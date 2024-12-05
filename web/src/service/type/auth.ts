export type User = {
  email: string;
  name: string;
};

export type Auth = {
  token: string;
  user: User;
};
