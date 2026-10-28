import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { I18nService } from './i18n.service';
import {
  Product,
  categorySlug,
  isCategorySlug,
} from './product.model';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  /** Absolute or site-root path, e.g. /catalog or full URL */
  canonicalPath?: string;
  /** Open Graph / social image — absolute URL preferred */
  imageUrl?: string;
  imageAlt?: string;
  /** Open Graph type. Product pages use `product`. */
  ogType?: 'website' | 'product';
  noIndex?: boolean;
  breadcrumbs?: SeoCrumb[];
  jsonLd?: object;
}

export interface SeoCrumb {
  name: string;
  path: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly brand = environment.siteName;
  private readonly origin = environment.siteUrl.replace(/\/$/, '');
  private readonly defaultImage = 'assets/images/slider/furniture_slide3.jpg';

  constructor(
    private title: Title,
    private meta: Meta,
    private i18n: I18nService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /** Full URL for a path on this site (no trailing slash on origin). */
  absoluteUrl(path: string): string {
    if (!path || path === '/') {
      return `${this.origin}/`;
    }
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.origin}${p}`;
  }

  /** Default meta for начална страница или fallback. */
  applyDefaults(canonicalPath = '/'): void {
    this.apply({
      title: this.i18n.t('seo.home.title'),
      description: this.i18n.t('seo.home.description'),
      keywords: this.i18n.t('seo.home.keywords'),
      canonicalPath,
      imageUrl: this.absoluteUrl(this.defaultImage),
      imageAlt: this.i18n.t('seo.home.imageAlt'),
    });
  }

  apply(config: SeoConfig): void {
    const title = this.formatPageTitle(config.title);
    const description = this.clamp(config.description);
    const canonical = this.canonicalUrl(config.canonicalPath);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    this.setCanonicalLink(canonical);

    const image = this.toAbsolute(config.imageUrl || this.defaultImage);
    const imageAlt = config.imageAlt || this.brand;

    this.meta.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.brand });
    this.meta.updateTag({ property: 'og:locale', content: this.i18n.lang === 'en' ? 'en_US' : 'bg_BG' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:secure_url', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: imageAlt });

    this.meta.updateTag({
      name: 'robots',
      content: config.noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    });

    if (config.noIndex) {
      this.removeJsonLd('seo-page-jsonld');
      this.removeJsonLd('seo-breadcrumb-jsonld');
      return;
    }

    const crumbs = config.breadcrumbs ?? this.crumbsFor(this.pathOf(canonical));
    this.setJsonLd('seo-page-jsonld', config.jsonLd ?? this.webPageLd(title, description, canonical));
    if (crumbs?.length) {
      this.setJsonLd('seo-breadcrumb-jsonld', this.breadcrumbLd(crumbs));
    } else {
      this.removeJsonLd('seo-breadcrumb-jsonld');
    }
  }

  /** Product detail page — dynamic title/description from catalog data. */
  applyProductPage(product: Product): void {
    const label = this.i18n.category(product.Category);
    const name = this.i18n.productName(product.Name);
    const slug = categorySlug(product.Category);
    const path = `/details/${encodeURIComponent(product.Id)}`;
    const description = this.describeProduct(product, label);
    const images = this.productImages(product);
    const crumbs: SeoCrumb[] = [
      { name: this.i18n.t('nav.home'), path: '/' },
      { name: this.i18n.t('nav.catalog'), path: '/catalog' },
    ];
    if (slug && label) {
      crumbs.push({ name: label, path: `/catalog/${slug}` });
    }
    crumbs.push({ name, path });

    const productLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description,
      image: images,
      sku: product.Id,
      brand: { '@type': 'Brand', name: this.brand },
      category: label,
      url: this.absoluteUrl(path),
      countryOfOrigin: 'BG',
    };

    if (product.Price && product.Price > 0) {
      productLd['offers'] = {
        '@type': 'Offer',
        priceCurrency: 'BGN',
        price: product.Price,
        availability: 'https://schema.org/InStock',
        url: this.absoluteUrl(path),
        seller: { '@id': `${this.origin}/#organization` },
      };
    }

    this.apply({
      title: label ? `${name} — ${label}` : name,
      description,
      keywords: [name, label, this.i18n.t('seo.kw.upholstery'), this.i18n.t('seo.kw.custom'), this.brand, this.i18n.t('seo.kw.city')]
        .filter(Boolean)
        .join(', '),
      canonicalPath: path,
      imageUrl: images[0],
      imageAlt: name,
      ogType: 'product',
      breadcrumbs: crumbs,
      jsonLd: productLd,
    });
  }

  /** Каталог — филтър по категория от URL. */
  applyCatalogPage(category: string, products: Product[]): void {
    const slug = categorySlug(category);
    if (slug && !isCategorySlug(slug)) {
      this.apply({
        title: this.i18n.t('nav.catalog'),
        description: this.i18n.t('seo.catalog.missing'),
        canonicalPath: `/catalog/${slug}`,
        noIndex: true,
      });
      return;
    }

    const path = slug ? `/catalog/${slug}` : '/catalog';
    const label = slug ? this.i18n.category(slug) : '';
    const listed = slug
      ? products.filter((product) => categorySlug(product.Category) === slug)
      : products;

    const title = label
      ? this.i18n.t('seo.catalog.categoryTitle', { label })
      : this.i18n.t('seo.catalog.title');
    const description = label
      ? this.i18n.t('seo.catalog.categoryDesc', { label })
      : this.i18n.t('seo.catalog.description');

    const crumbs: SeoCrumb[] = [
      { name: this.i18n.t('nav.home'), path: '/' },
      { name: this.i18n.t('nav.catalog'), path: '/catalog' },
    ];
    if (label) {
      crumbs.push({ name: label, path });
    }

    this.apply({
      title,
      description,
      keywords: label
        ? `${label}, ${label} ${this.i18n.t('seo.kw.city')}, ${this.i18n.t('seo.kw.upholstery')}, ${this.i18n.t('seo.kw.custom')}, ${this.brand}`
        : this.i18n.t('seo.home.keywords'),
      canonicalPath: path,
      imageAlt: label ? this.i18n.t('seo.catalog.imageAltCategory', { label }) : this.i18n.t('seo.catalog.imageAlt'),
      breadcrumbs: crumbs,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: this.formatPageTitle(title),
        description: this.clamp(description),
        url: this.absoluteUrl(path),
        inLanguage: this.i18n.lang,
        isPartOf: { '@id': `${this.origin}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: listed.length,
          itemListElement: listed.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: this.i18n.productName(product.Name),
            url: this.absoluteUrl(`/details/${encodeURIComponent(product.Id)}`),
          })),
        },
      },
    });
  }

  injectOrganizationJsonLd(): void {
    this.setJsonLd('seo-site-jsonld', this.siteGraph());
  }

  private formatPageTitle(pageTitle: string): string {
    const b = this.brand;
    if (pageTitle.toLowerCase().includes(b.toLowerCase())) {
      return pageTitle;
    }
    return `${pageTitle} | ${b}`;
  }

  private describeProduct(product: Product, label: string): string {
    const kind = (label || this.i18n.t('seo.kind')).toLocaleLowerCase(this.i18n.lang === 'en' ? 'en' : 'bg');
    const body = this.i18n.productDescription(product.Description || '').replace(/\s+/g, ' ').trim();
    const name = this.i18n.productName(product.Name);
    const text = body
      ? this.i18n.t('seo.product.withBody', { name, kind, body })
      : this.i18n.t('seo.product.fallback', { name, kind });
    return this.clamp(text);
  }

  private productImages(product: Product): string[] {
    const count = Math.max(product.ImageCount || 1, 1);
    const base = (product.Image || product.Id || '').toLowerCase();
    return Array.from({ length: count }, (_, index) =>
      this.absoluteUrl(`assets/images/products/${base}.${index + 1}.webp`)
    );
  }

  private webPageLd(title: string, description: string, canonical: string): object {
    const path = this.pathOf(canonical);
    const type = path === '/contact' ? 'ContactPage' : path === '/about' ? 'AboutPage' : 'WebPage';
    return {
      '@context': 'https://schema.org',
      '@type': type,
      name: title,
      description,
      url: canonical,
      inLanguage: this.i18n.lang,
      isPartOf: { '@id': `${this.origin}/#website` },
    };
  }

  private crumbsFor(path: string): SeoCrumb[] | null {
    const names: Record<string, string> = {
      '/about': this.i18n.t('nav.about'),
      '/contact': this.i18n.t('nav.contact'),
      '/projects': this.i18n.t('nav.projects'),
    };
    const name = names[path];
    if (!name) {
      return null;
    }
    return [
      { name: this.i18n.t('nav.home'), path: '/' },
      { name, path },
    ];
  }

  private breadcrumbLd(crumbs: SeoCrumb[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: this.absoluteUrl(crumb.path),
      })),
    };
  }

  private siteGraph(): object {
    const showroom = {
      '@type': 'PostalAddress',
      streetAddress: this.i18n.t('seo.org.street.showroom'),
      addressLocality: this.i18n.t('seo.org.locality.showroom'),
      addressRegion: this.i18n.t('seo.org.region'),
      addressCountry: 'BG',
    };
    const hours = {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    };
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${this.origin}/#organization`,
          name: this.brand,
          url: `${this.origin}/`,
          logo: this.absoluteUrl('assets/images/logo/logo-clear.png'),
          image: this.absoluteUrl(this.defaultImage),
          description: this.i18n.t('seo.home.description'),
          foundingDate: '1995',
          email: 'belcarobulgaria@gmail.com',
          telephone: '+359899908588',
          address: showroom,
          sameAs: [
            'https://www.facebook.com/p/Belcaro-Bulgaria-61575156623983/',
            'https://www.instagram.com/belcaro.bulgaria/',
            'https://www.tiktok.com/@belcaro.bg',
          ],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+359899908588',
              contactType: 'customer service',
              availableLanguage: ['Bulgarian', 'English'],
              areaServed: 'BG',
            },
            {
              '@type': 'ContactPoint',
              telephone: '+359899906946',
              contactType: 'sales',
              availableLanguage: ['Bulgarian', 'English'],
              areaServed: 'BG',
            },
          ],
        },
        {
          '@type': 'FurnitureStore',
          '@id': `${this.origin}/#showroom`,
          name: this.i18n.t('seo.org.showroom'),
          parentOrganization: { '@id': `${this.origin}/#organization` },
          url: this.absoluteUrl('/contact'),
          image: this.absoluteUrl(this.defaultImage),
          telephone: '+359899908588',
          email: 'belcarobulgaria@gmail.com',
          address: showroom,
          openingHoursSpecification: hours,
        },
        {
          '@type': 'FurnitureStore',
          '@id': `${this.origin}/#store`,
          name: this.i18n.t('seo.org.store'),
          parentOrganization: { '@id': `${this.origin}/#organization` },
          url: this.absoluteUrl('/contact'),
          telephone: '+359899906946',
          address: {
            '@type': 'PostalAddress',
            streetAddress: this.i18n.t('seo.org.street.store'),
            addressLocality: this.i18n.t('seo.org.locality.store'),
            addressCountry: 'BG',
          },
          openingHoursSpecification: hours,
        },
        {
          '@type': 'WebSite',
          '@id': `${this.origin}/#website`,
          url: `${this.origin}/`,
          name: this.brand,
          inLanguage: this.i18n.lang,
          publisher: { '@id': `${this.origin}/#organization` },
        },
      ],
    };
  }

  private canonicalUrl(canonicalPath?: string): string {
    if (!canonicalPath) {
      return `${this.origin}/`;
    }
    if (canonicalPath.startsWith('http')) {
      return canonicalPath.replace(/\/+$/, '') || canonicalPath;
    }
    const path = canonicalPath.split('?')[0].replace(/\/+$/, '') || '/';
    return this.absoluteUrl(path);
  }

  private pathOf(canonical: string): string {
    try {
      const path = new URL(canonical).pathname.replace(/\/+$/, '') || '/';
      return path;
    } catch {
      return '/';
    }
  }

  private toAbsolute(url: string): string {
    if (!url) {
      return this.absoluteUrl(this.defaultImage);
    }
    if (url.startsWith('http')) {
      return url;
    }
    return this.absoluteUrl(url);
  }

  private clamp(text: string, max = 158): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= max) {
      return clean;
    }
    const cut = clean.slice(0, max - 1);
    const last = cut.lastIndexOf(' ');
    return `${(last > 80 ? cut.slice(0, last) : cut).replace(/[.,;:\s]+$/, '')}…`;
  }

  private setJsonLd(id: string, data: object): void {
    const head = this.document.head;
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      head.appendChild(script);
    }
    script.text = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  private removeJsonLd(id: string): void {
    this.document.getElementById(id)?.remove();
  }

  private setCanonicalLink(href: string): void {
    const head = this.document.head;
    let link = head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
