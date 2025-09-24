import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export type NotificationTargetType = 'Other' | 'VendorTask' | 'Vendor' | 'Entity' | 'User' | number;

export interface AuditRecord {
  id: number;
  createdAt: string;
  actorUserId?: number;
  actorName?: string;
  action?: string;
  targetType?: NotificationTargetType;
  targetId?: number;
  targetTitle?: string;
  message?: string;
  details?: string;
}

export interface AuditQuery {
  page?: number;
  pageSize?: number;
  targetType?: NotificationTargetType | null;
  action?: string | null;
  actor?: string | null;
  targetTitle?: string | null;
  targetId?: number | null;
  from?: string | Date | null;
  to?: string | Date | null;
}

export interface AuditQueryResult {
  items: AuditRecord[];
  page: number;
  pageSize: number;
  totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  constructor(private http: HttpClient) {}

  async query(q: AuditQuery): Promise<AuditQueryResult> {
    let p = new HttpParams();
    const add = (k: string, v: any) => { if (v != null && v !== '') p = p.set(k, String(v)); };
    add('page', q.page ?? 1);
    add('pageSize', q.pageSize ?? 20);
    add('targetType', q.targetType ?? '');
    add('action', q.action ?? '');
    add('actor', q.actor ?? '');
    add('targetTitle', q.targetTitle ?? '');
    add('targetId', q.targetId ?? '');
    add('from', q.from ? (q.from instanceof Date ? q.from.toISOString() : q.from) : '');
    add('to', q.to ? (q.to instanceof Date ? q.to.toISOString() : q.to) : '');
    return this.http.get<AuditQueryResult>(`${environment.apiBase}/audit/query`, { params: p }).toPromise() as Promise<AuditQueryResult>;
  }
}
