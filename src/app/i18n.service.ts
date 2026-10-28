import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lang, translations } from './i18n/translations';
import { categoryLabel } from './product.model';

const STORAGE_KEY = 'belcaro-lang';

const PRODUCT_DESC_EN: Record<string, string> = {
  'Ръчно изработен фотьойл с ергономичен дизайн и първокласни материали. Комбинира стил и комфорт за изискани пространства.':
    'A handcrafted armchair with an ergonomic design and first-rate materials. It combines style and comfort for refined spaces.',
  'Луксозен ръчно изработен стол с ергономичен дизайн. Осигурява комфорт и стил за всяко пространство.':
    'A luxurious handcrafted chair with an ergonomic design. Comfort and style for any space.',
  'Луксозен ръчно изработен диван с първокласни материали, предлагащ несравним комфорт и изискан дизайн. Перфектен за стилни интериори.':
    'A luxurious handcrafted sofa in first-rate materials, with rare comfort and a refined design. Made for considered interiors.',
  'Елегантно и удобно легло с висококачествена тапицерия. Ръчно изработено за съвършен баланс между комфорт и стил.':
    'An elegant, comfortable bed with high-quality upholstery. Handcrafted for a precise balance of comfort and style.',
  'Уникална дизайнерска маса, съчетаваща стил и функционалност. Изработена с внимание към детайла и устойчивостта.':
    'A distinctive designer table, joining style and function. Made with attention to detail and durability.',
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang$ = new BehaviorSubject<Lang>(this.readLang());
  lang: Lang = this.lang$.value;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.applyDocumentLang(this.lang);
  }

  setLang(lang: Lang): void {
    if (lang !== 'bg' && lang !== 'en') {
      return;
    }
    if (lang === this.lang) {
      return;
    }
    this.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode */
    }
    this.applyDocumentLang(lang);
    this.lang$.next(lang);
  }

  t(key: string, params?: Record<string, string | number>): string {
    const table = translations[this.lang] || translations.bg;
    let value = table[key] ?? translations.bg[key] ?? key;
    if (params) {
      Object.keys(params).forEach((name) => {
        value = value.split(`{{${name}}}`).join(String(params[name]));
      });
    }
    return value;
  }

  category(value: string): string {
    return categoryLabel(value, this.lang);
  }

  productName(name: string): string {
    if (!name || this.lang === 'bg') {
      return name || '';
    }
    return name.replace(/^Пуф(?=\s|$)/, 'Pouf');
  }

  productDescription(description: string): string {
    if (!description || this.lang === 'bg') {
      return description || '';
    }
    return PRODUCT_DESC_EN[description] || description;
  }

  private readLang(): Lang {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'bg') {
        return saved;
      }
    } catch {
      /* ignore */
    }
    return 'bg';
  }

  private applyDocumentLang(lang: Lang): void {
    const root = this.document?.documentElement;
    if (!root) {
      return;
    }
    root.lang = lang;
    root.setAttribute('xml:lang', lang);
  }
}
