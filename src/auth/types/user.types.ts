export type UserPayload = {
  _id: string;
  email: string;
  roles: string[];
};

export type LoginResponse = {
  access_token: string;
};
