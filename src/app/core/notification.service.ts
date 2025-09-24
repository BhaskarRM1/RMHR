import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export type NotificationTargetType = 0 | 1 | 2 | 3 | 4 | 'Other' | 'VendorTask' | 'Vendor' | 'Entity' | 'User';

export interface NotificationItem {
  id: number;
  userId?: number;
  targetType: NotificationTargetType;
  targetId?: number;
  targetTitle?: string;
  title: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
  readAt?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  list(unreadOnly: boolean = true) {
    const q = unreadOnly ? '?unreadOnly=true' : '';
    const headers = new HttpHeaders({ 'X-Skip-Loading': 'true' });
    return this.http.get<NotificationItem[]>(`${environment.apiBase}/Notifications${q}`, { headers }).toPromise();
  }

  markRead(id: number) {
    const headers = new HttpHeaders({ 'X-Skip-Loading': 'true' });
    return this.http.post(`${environment.apiBase}/Notifications/${id}/read`, {}, { headers }).toPromise();
  }

  markAllRead() {
    const headers = new HttpHeaders({ 'X-Skip-Loading': 'true' });
    return this.http.post(`${environment.apiBase}/Notifications/read-all`, {}, { headers }).toPromise();
  }
}
