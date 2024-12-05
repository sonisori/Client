import { KyInstance } from "ky";

export type User = {
  email: string;
  name: string;
};

export type Auth = {
  client: KyInstance;
  token: string;
  user: User;
};
