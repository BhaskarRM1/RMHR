import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Role { id:number; name:string; description?:string; }
export interface RoleCreateDto { name:string; description?:string; }
export interface RoleUpdateDto { name:string; description?:string; }

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private http: HttpClient){}
  list(){ return this.http.get<Role[]>(`${environment.apiBase}/roles`).toPromise(); }
}
