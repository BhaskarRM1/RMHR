import { Component, signal, inject, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../app/core/auth.service';
import { AppRoleName } from '../../app/core/roles';
import { ProfileService } from '../../app/core/profile.service';

interface NavItem {
  label: string;
  icon: string;
  link: string | any[];
  adminOnly?: boolean;
  rolesAllowed?: string[];
  children?: NavItem[];
}

@Component({
  selector: 'app-left-nav',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {
  collapsed = signal(localStorage.getItem('navCollapsed') === '1');
  private auth = inject(AuthService);
  constructor(@Inject(DOCUMENT) private doc: Document) { }

  ngOnInit() { this.syncBodyClass(); }

  items: NavItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', link: ['ROLE_BASE', 'dashboard'] },
    { label: 'All Tasks', icon: 'task', link: ['/tasks'] },
    { label: 'Users', icon: 'group', link: ['/users'], adminOnly: true, rolesAllowed: [AppRoleName.SystemAdmin, AppRoleName.EntityAdmin] },
    { label: 'Entities', icon: 'apartment', link: ['ROLE_BASE', 'entities'], adminOnly: true, rolesAllowed: [AppRoleName.SystemAdmin] },
    { label: 'Vendors', icon: 'store', link: ['vendors'], adminOnly: true, rolesAllowed: [AppRoleName.SystemAdmin, AppRoleName.EntityAdmin] },
    { label: 'Audit Log', icon: 'rule', link: ['ROLE_BASE', 'audit'], adminOnly: true, rolesAllowed: [AppRoleName.SystemAdmin, AppRoleName.EntityAdmin] },
    {
      label: 'Tasks', icon: 'task', link: ['ROLE_BASE'], adminOnly: true, rolesAllowed: [AppRoleName.SystemAdmin],
      children: [
        { label: 'Task Categories', icon: 'category', link: ['ROLE_BASE', 'task-categories'], adminOnly: true, rolesAllowed: [AppRoleName.SystemAdmin] },
        { label: 'Task Masters', icon: 'list_alt', link: ['ROLE_BASE', 'task-masters'], adminOnly: true, rolesAllowed: [AppRoleName.SystemAdmin] },
      ]
    },
    { label: 'Calendar', icon: 'calendar_today', link: ['/calendar'] },
    { label: 'Settings', icon: 'settings', link: ['/profile'] },
  ];

  visibleItems() {
    const role = this.auth.role;
    const isAdmin = this.auth.isSystemAdmin || this.auth.isEntityAdmin;
    return this.items.filter(i => {
      if (i.adminOnly && !isAdmin) return false;
      if (i.rolesAllowed && i.rolesAllowed.length > 0) return role ? i.rolesAllowed.includes(role) : false;
      return true;
    });
  }

  linkFor(it: NavItem) {
    if (!Array.isArray(it.link)) return it.link;
    const base = this.basePath();
    if (it.link.length > 0 && it.link[0] === 'ROLE_BASE') {
      return [base, ...it.link.slice(1)];
    }
    return it.link;
  }

  visibleChildren(group: NavItem) {
    if (!group.children) return [] as NavItem[];
    const role = this.auth.role;
    const isAdmin = this.auth.isSystemAdmin || this.auth.isEntityAdmin;
    return group.children.filter(i => {
      if (i.adminOnly && !isAdmin) return false;
      if (i.rolesAllowed && i.rolesAllowed.length > 0) return role ? i.rolesAllowed.includes(role) : false;
      return true;
    });
  }

  private basePath(): string {
    if (this.auth.isSystemAdmin) return '/system-admin';
    if (this.auth.isEntityAdmin) return '/entity-admin';
    if (this.auth.isEntityUser) return '/entity-user';
    if (this.auth.isVendorAdmin) return '/vendor-admin';
    if (this.auth.isVendorUser) return '/vendor-user';
    return '/dashboard';
  }

  toggle() {
    const next = !this.collapsed();
    this.collapsed.set(next);
    localStorage.setItem('navCollapsed', next ? '1' : '0');
    this.syncBodyClass();
  }

  private syncBodyClass() {
    const body = this.doc.body;
    if (this.collapsed()) body.classList.add('nav-collapsed');
    else body.classList.remove('nav-collapsed');
  }
}
