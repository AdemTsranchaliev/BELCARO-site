import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
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

  constructor(
    public wishlistService: WishlistService,
    private router: Router,
    private seo: SeoService
  ) {
    const path = this.router.url.split('?')[0];
    this.isHome = path === '/' || path === '';
  }

  ngOnInit(): void {
    this.seo.injectOrganizationJsonLd();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        const url = this.router.url.split('?')[0];
        this.isHome = url === '/' || url === '';
        if (url.startsWith('/catalog') || url.startsWith('/details')) {
          return;
        }
        const seoData = this.mergeRouteSeo(this.router.routerState.snapshot.root);
        if (seoData?.title && seoData.description) {
          this.seo.apply({
            title: seoData.title,
            description: seoData.description,
            keywords: seoData.keywords,
            canonicalPath: url,
          });
        } else if (url === '/' || url === '') {
          this.seo.applyDefaults('/');
        } else {
          this.seo.applyDefaults(url);
        }
      });

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

  private mergeRouteSeo(root: ActivatedRouteSnapshot): {
    title: string;
    description: string;
    keywords?: string;
  } | null {
    let merged: { title?: string; description?: string; keywords?: string } = {};
    let snap: ActivatedRouteSnapshot | null = root;
    while (snap) {
      const seo = snap.data?.['seo'];
      if (seo && typeof seo === 'object') {
        merged = { ...merged, ...seo };
      }
      snap = snap.firstChild;
    }
    if (merged.title && merged.description) {
      return {
        title: merged.title,
        description: merged.description,
        keywords: merged.keywords,
      };
    }
    return null;
  }
}
