import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import emailjs from '@emailjs/browser';
import { I18nService } from '../i18n.service';
import { Lang } from '../i18n/translations';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  name: string = '';
  email: string = '';
  message: string = '';

  private mapLang: Lang | null = null;
  private mapSafe: SafeResourceUrl | null = null;

  constructor(
    private i18n: I18nService,
    private sanitizer: DomSanitizer
  ) { }

  get mapEmbed(): SafeResourceUrl {
    if (this.mapLang !== this.i18n.lang || !this.mapSafe) {
      this.mapLang = this.i18n.lang;
      const hl = this.mapLang === 'en' ? 'en' : 'bg';
      const url = `https://maps.google.com/maps?q=%D1%83%D0%BB.%20%D0%A6%D0%B0%D1%80%D1%81%D0%BA%D0%B8%20%D0%BF%D0%B0%D1%80%D0%BA%204%2C%20%D0%9A%D0%B0%D0%B7%D0%B8%D1%87%D0%B5%D0%BD%D0%B5&z=16&output=embed&hl=${hl}`;
      this.mapSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return this.mapSafe;
  }

  onSubmitMessage(ev: Event): void {
    ev.preventDefault();
    this.sendEmail();
  }

  sendEmail() {
    if (!this.name || !this.email || !this.message) {
      alert(this.i18n.t('contact.alert.required'));
      return;
    }

    const templateParams = {
      from_name: this.name,
      from_email: this.email,
      message: this.message
    };

    emailjs.send('service_bciek7b', 'template_y510pms', templateParams, '8XsYlheyqS82jrHKu')
      .then(() => {
          alert(this.i18n.t('contact.alert.ok'));
          this.name = '';
          this.email = '';
          this.message = '';
      }, (err) => {
          alert(this.i18n.t('contact.alert.error'));
          console.error(err);
      });
  }
}
