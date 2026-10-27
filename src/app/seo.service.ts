import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { Product, categoryLabel } from './product.model';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  /** Absolute or site-root path, e.g. /catalog or full URL */
  canonicalPath?: string;
  /** Open Graph / social image — absolute URL preferred */
  imageUrl?: string;
  noIndex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly brand = environment.siteName;
  private readonly defaultTitle = `${this.brand} — луксозна мека мебел и интериор`;
  private readonly defaultDescription =
    'Belcaro — премиум мека мебел, дивани, фотьойли и интериорни решения в София. Качество, дизайн и комфорт за вашия дом.';
  private readonly defaultKeywords =
    'мека мебел, дивани София, луксозни мебели, Belcaro, интериор, фотьойли, каталог мебели';

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /** Full URL for a path on this site (no trailing slash on origin). */
  absoluteUrl(path: string): string {
    const base = environment.siteUrl.replace(/\/$/, '');
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
  }

  /** Default meta for начална страница или fallback. */
  applyDefaults(canonicalPath = '/'): void {
    this.apply({
      title: this.defaultTitle,
      description: this.defaultDescription,
      keywords: this.defaultKeywords,
      canonicalPath,
      imageUrl: this.absoluteUrl('assets/images/slider/furniture_slide3.jpg'),
    });
  }

  apply(config: SeoConfig): void {
    const title = this.formatPageTitle(config.title);

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    const canonical =
      config.canonicalPath != null
        ? config.canonicalPath.startsWith('http')
          ? config.canonicalPath
          : this.absoluteUrl(config.canonicalPath)
        : this.absoluteUrl('/');

    this.setCanonicalLink(canonical);

    const image =
      config.imageUrl ||
      this.absoluteUrl('assets/images/slider/furniture_slide3.jpg');

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.brand });
    this.meta.updateTag({ property: 'og:locale', content: 'bg_BG' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: image });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    if (config.noIndex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    }
  }

  /** Product detail page — dynamic title/description from catalog data. */
  applyProductPage(product: Product, canonicalPath: string): void {
    const desc =
      product.Description?.trim()?.slice(0, 160) ||
      `${product.Name} — ${product.Category}. ${this.brand}: луксозна мека мебел и интериор.`;
    const firstImage = this.absoluteUrl(
      `assets/images/products/${product.Image.toLowerCase()}.1.webp`
    );

    this.apply({
      title: product.Name,
      description: desc,
      keywords: `${product.Name}, ${product.Category}, мека мебел, ${this.brand}`,
      canonicalPath: canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`,
      imageUrl: firstImage,
    });
  }

  /** Каталог — филтър по категория от URL. */
  applyCatalogPage(categorySlug: string, canonicalPath: string): void {
    const path = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    if (categorySlug) {
      const label = categoryLabel(categorySlug);
      this.apply({
        title: `${label} — каталог`,
        description: `Разгледайте ${label} в каталога на ${this.brand}: мека мебел и интериор с внимание към детайла.`,
        keywords: `${label}, каталог мебели, мека мебел, ${this.brand}`,
        canonicalPath: path,
      });
    } else {
      this.apply({
        title: 'Каталог мебели',
        description: `Пълният каталог на ${this.brand}: дивани, фотьойли, столове, легла и маси — премиум мека мебел за вашия дом.`,
        keywords: this.defaultKeywords,
        canonicalPath: path,
      });
    }
  }

  private formatPageTitle(pageTitle: string): string {
    const b = this.brand;
    if (pageTitle.toLowerCase().includes(b.toLowerCase())) {
      return pageTitle;
    }
    return `${pageTitle} | ${b}`;
  }

  injectOrganizationJsonLd(): void {
    const id = 'seo-organization-jsonld';
    if (this.document.getElementById(id)) {
      return;
    }
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: this.brand,
      description: this.defaultDescription,
      url: environment.siteUrl.replace(/\/$/, ''),
      areaServed: {
        '@type': 'City',
        name: 'София',
      },
    });
    this.document.head.appendChild(script);
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
