// The access token lives in memory only: it is lost on page reload.
let accessToken: string | null = null;

// The refresh token survives reloads, see docs/architecture.md §7
const REFRESH_TOKEN_KEY = 'refreshToken';

type TokenResponse = {
  token: string;
  refresh_token: string;
};

export function getAccessToken() {
  return accessToken;
}

// Called after login and after each refresh
export function saveTokens(tokens: TokenResponse) {
  accessToken = tokens.token;
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

// On page load: trade the stored refresh token for new tokens
export async function restoreSession() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (refreshToken === null) {
    return;
  }

  try {
    const response = await fetch('/api/token/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      saveTokens(await response.json());
    } else if (response.status === 401) {
      // Expired or already used: the user has to log in again
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch {
    // API unreachable: keep the refresh token and try again next time
  }
}
