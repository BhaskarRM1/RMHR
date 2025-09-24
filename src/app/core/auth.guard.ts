import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { isTokenValid } from './jwt.util';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (!isTokenValid(token)) { auth.logout(); return false; }
  return true;
};
