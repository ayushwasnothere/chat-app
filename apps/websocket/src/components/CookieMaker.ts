export const makeCookieJWT = (token: string) => ({
  headers: {
    Cookie: `next-auth.session-token=${token};`,
  },
});
