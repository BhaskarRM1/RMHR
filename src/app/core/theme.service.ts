import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private cls = 'dark-theme';
  dark = signal(false);

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const pref = this.getCookie('theme');
      const isDark = pref ? pref === 'dark' : false;
      this.apply(isDark);
    }
  }

  isDark() { return this.dark(); }

  toggle() {
    if (isPlatformBrowser(this.platformId)) {
      this.apply(!this.dark());
    }
  }

  private apply(val: boolean) {
    this.dark.set(val);
    const body = this.doc.body;
    if (val) body.classList.add(this.cls);
    else body.classList.remove(this.cls);

    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    this.doc.cookie = `theme=${val ? 'dark' : 'light'}; expires=${expires}; path=/`;
  }

  private getCookie(name: string): string | null {
    const m = this.doc.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
}
