export type JwtPayload = {
  email: string;
  sub: string; // User ID
  roles: string[];
};
