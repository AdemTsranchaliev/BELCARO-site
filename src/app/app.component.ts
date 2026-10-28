import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, skip } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { I18nService } from './i18n.service';
import { SeoService } from './seo.service';
import { WishlistService } from './wishlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'belcaro-site';
  isHome = true;
  langOpen = false;

  constructor(
    public wishlistService: WishlistService,
    public i18n: I18nService,
    private router: Router,
    private seo: SeoService
  ) {
    const path = this.router.url.split('?')[0];
    this.isHome = path === '/' || path === '';
  }

  @HostListener('document:click')
  closeLang(): void {
    this.langOpen = false;
  }

  toggleLang(event: Event): void {
    event.stopPropagation();
    this.langOpen = !this.langOpen;
  }

  chooseLang(lang: 'bg' | 'en', event: Event): void {
    event.stopPropagation();
    this.i18n.setLang(lang);
    this.langOpen = false;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        this.syncSeo();
      });

    this.i18n.lang$.pipe(skip(1)).subscribe(() => this.syncSeo());
    this.syncSeo();

    if (environment.production) {
      console.log('Running in production mode');
    }
    else {
      console.log("dev")
    }

    // Add event listener for offcanvas hide event
    document.addEventListener('hidden.bs.offcanvas', () => {
      // Remove any lingering backdrops
      const backdrops = document.getElementsByClassName('offcanvas-backdrop');
      Array.from(backdrops).forEach(backdrop => {
        (backdrop as HTMLElement).remove();
      });
    });
  }

  closeMobileMenu() {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    if (closeButton) {
      (closeButton as HTMLElement).click();
    }
  }

  get privacyHref(): string {
    const subject = this.i18n.lang === 'en'
      ? 'Belcaro — privacy policy'
      : 'Belcaro — политика за поверителност';
    return `mailto:belcarobulgaria@gmail.com?subject=${encodeURIComponent(subject)}`;
  }

  private syncSeo(): void {
    this.seo.injectOrganizationJsonLd();
    const url = this.router.url.split('?')[0] || '/';
    this.isHome = url === '/' || url === '';
    if (url.startsWith('/catalog') || url.startsWith('/details')) {
      return;
    }
    const page = this.pageSeo(url);
    if (page) {
      this.seo.apply({
        title: page.title,
        description: page.description,
        keywords: page.keywords,
        canonicalPath: url || '/',
        noIndex: page.noIndex,
      });
      return;
    }
    this.seo.applyDefaults(url || '/');
  }

  private pageSeo(url: string): {
    title: string;
    description: string;
    keywords?: string;
    noIndex?: boolean;
  } | null {
    const keyByPath: Record<string, string> = {
      '/': 'home',
      '/contact': 'contact',
      '/projects': 'projects',
      '/about': 'about',
      '/wishlist': 'wishlist',
    };
    const key = keyByPath[url];
    if (!key) {
      return null;
    }
    return {
      title: this.i18n.t(`seo.${key}.title`),
      description: this.i18n.t(`seo.${key}.description`),
      keywords: key === 'wishlist' ? undefined : this.i18n.t(`seo.${key}.keywords`),
      noIndex: key === 'wishlist',
    };
  }
}
