export const mergeCookies = (cookies: string[]) => {
  return cookies?.reduce((acc, val) => acc.replace("Path=/", val), "Path=/");
};
