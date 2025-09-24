// Shared JWT helpers: parse, validate, and role extraction
export function parseJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = parseJwt(token);
  const now = Date.now();
  const expMs = payload?.exp ? payload.exp * 1000 : null;
  const nbfMs = payload?.nbf ? payload.nbf * 1000 : null;
  return !!payload && (!expMs || expMs > now) && (!nbfMs || nbfMs <= now);
}

export function rolesFromPayload(p: any): string | undefined {
  if (!p) return undefined;
  const claim =
    p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
    p['role'] ??
    p['roles'];
  if (Array.isArray(claim)) {
    const v = claim.map(String).find(Boolean);
    return v;
  }
  if (typeof claim === 'string') {
    // Accept single string; allow comma/space separated
    const parts = claim.split(/[ ,]+/).filter(Boolean);
    return parts[0];
  }
  return undefined;
}
