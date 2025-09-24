import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isTokenValid, parseJwt, rolesFromPayload } from './jwt.util';
import { ProfileService } from './profile.service';
import { environment } from '../../environments/environment';
import { AppRoleName, roleIdToName } from './roles';

interface LoginRequest { email: string; password: string; }
type AuthResponse = { token: string; email: string; fullName: string; roles?: (string | number)[]; role?: string | number };

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private profiles: ProfileService) { }
  token = signal<string | null>(localStorage.getItem('token'));
  // roles = signal<string[]>([]);


  async login(req: LoginRequest) {
    const res = await this.http.post<AuthResponse>(`${environment.apiBase}/auth/login`, req).toPromise();
    if (!res) return;
    const norm = (r: string | number | undefined | null) => {
      if (r == null) return undefined;
      return typeof r === 'number' ? roleIdToName(r) : r;
    };
    const roles = Array.isArray(res.roles)
      ? (res.roles.map(norm).filter(Boolean) as string[])
      : (res.role ? [norm(res.role)!] : []);
    this.token.set(res.token);
    localStorage.setItem('token', res.token);
    // Prefer profile service for identity and role info
    await this.profiles.refresh();
  }
  logout() {
    this.token.set(null);
    // this.roles.set([]);
    this._cacheRole = null;
    this.profiles.clear();
    localStorage.removeItem('token');
    location.href = '/login';
  }
  private _cacheRole: string | undefined | null;
  get role() {
    if (this._cacheRole) return this._cacheRole;
    const payload = parseJwt(this.token() ?? '');

    this._cacheRole = rolesFromPayload(payload);
    return this._cacheRole;
  }
  hasRole(r: string) { return this.role === r }
  isAuth() { return isTokenValid(this.token()); }

  get isSystemAdmin() { return this.role === AppRoleName.SystemAdmin; }
  get isEntityAdmin() { return this.role === AppRoleName.EntityAdmin; }
  get isEntityUser() { return this.role === AppRoleName.EntityUser; }
  get isVendorAdmin() { return this.role === AppRoleName.VendorAdmin; }
  get isVendorUser() { return this.role === AppRoleName.VendorUser; }
}
