import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ProfileDto {
  fullName: string;
  email: string;
  phone?: string;
  about?: string;
  pan?: string;
  address1?: string;
  address2?: string;
  entityName?: string | null;
  vendorName?: string | null;
  role?: string | number;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) { }

  public profile: ProfileDto | null = null;

  async getProfile(): Promise<ProfileDto | undefined> {
    try {
      if (this.profile) return this.profile;
      const res = await this.http
        .get<ProfileDto>(`${environment.apiBase}/auth/me`)
        .toPromise();
      this.profile = res || null;
      return this.profile || undefined;
    } catch {
      return undefined;
    }
  }

  async refresh(): Promise<ProfileDto | undefined> {
    try {
      const res = await this.http
        .get<ProfileDto>(`${environment.apiBase}/auth/me`)
        .toPromise();
      this.profile = res || null;
      return this.profile || undefined;
    } catch {
      return undefined;
    }
  }

  async updateProfile(body: ProfileDto): Promise<ProfileDto | undefined> {
    try {
      const res = await this.http
        .put<ProfileDto>(`${environment.apiBase}/auth/me`, body)
        .toPromise();
      this.profile = res || null;
      return this.profile || undefined;
    } catch {
      return undefined;
    }
  }

  clear() { this.profile = null; }

}
