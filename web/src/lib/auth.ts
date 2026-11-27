// The access token lives in memory only: it is lost on page reload.
// PR 1.2 (refresh token) will restore the session after a reload.
let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}
