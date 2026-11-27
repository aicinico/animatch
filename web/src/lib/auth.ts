// The access token lives in memory only: it is lost on page reload.
let accessToken: string | null = null;

// The refresh token survives reloads, see docs/architecture.md §7
const REFRESH_TOKEN_KEY = 'refreshToken';

type TokenResponse = {
  token: string;
  refresh_token: string;
};

// Called after login and after each refresh
export function saveTokens(tokens: TokenResponse) {
  accessToken = tokens.token;
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

// On page load: trade the stored refresh token for new tokens
export async function restoreSession() {
  await refreshTokens();
}

// Forget the tokens, then ask the API to invalidate the refresh token
export async function logout() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  accessToken = null;
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  if (refreshToken === null) {
    return;
  }

  try {
    await fetch('/api/token/invalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    // API unreachable: the refresh token will expire on its own
  }
}

// fetch() that sends the access token and, if it has expired,
// gets new tokens and tries once more
export async function apiFetch(url: string, init: RequestInit = {}) {
  let response = await fetchWithToken(url, init);

  if (response.status === 401 && (await refreshTokens())) {
    response = await fetchWithToken(url, init);
  }

  return response;
}

function fetchWithToken(url: string, init: RequestInit) {
  const headers = new Headers(init.headers);
  if (accessToken !== null) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return fetch(url, { ...init, headers });
}

// The refresh token works only once: if a refresh is already running,
// wait for it instead of sending the same token a second time
let refreshInProgress: Promise<boolean> | null = null;

function refreshTokens() {
  if (refreshInProgress === null) {
    refreshInProgress = sendRefreshRequest().finally(() => {
      refreshInProgress = null;
    });
  }
  return refreshInProgress;
}

// Returns true when new tokens were received
async function sendRefreshRequest() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (refreshToken === null) {
    return false;
  }

  try {
    const response = await fetch('/api/token/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      saveTokens(await response.json());
      return true;
    }
    if (response.status === 401) {
      // Expired or already used: the user has to log in again
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    return false;
  } catch {
    // API unreachable: keep the refresh token and try again next time
    return false;
  }
}
