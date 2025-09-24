import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export function roleGuard(requiredRoles: string[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    const auth = inject(AuthService)

    const allowed = requiredRoles.includes(auth.role ?? '');
    if (!allowed) { router.navigateByUrl('/dashboard'); return false; }
    return true;
  };
}
