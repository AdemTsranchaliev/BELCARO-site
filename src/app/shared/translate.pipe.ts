import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../i18n.service';

@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(key: string, params?: Record<string, string | number>): string {
    return this.i18n.t(key, params);
  }
}

@Pipe({ name: 'locName', pure: false })
export class ProductNamePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(name: string): string {
    return this.i18n.productName(name);
  }
}

@Pipe({ name: 'locDesc', pure: false })
export class ProductDescPipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(description: string): string {
    return this.i18n.productDescription(description);
  }
}

@Pipe({ name: 'cat', pure: false })
export class CategoryPipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(value: string): string {
    return this.i18n.category(value);
  }
}
