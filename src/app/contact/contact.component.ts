import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  name: string = '';
  email: string = '';
  message: string = '';

  constructor() { }

  sendEmail() {
    if (!this.name || !this.email || !this.message) {
      alert('Моля, попълнете всички полета!');
      return;
    }

    const templateParams = {
      from_name: this.name,
      from_email: this.email,
      message: this.message
    };

    emailjs.send('service_bciek7b', 'template_y510pms', templateParams, '8XsYlheyqS82jrHKu')
      .then(() => {
          alert('Съобщението беше изпратено успешно!');
          this.name = '';
          this.email = '';
          this.message = '';
      }, (err) => {
          alert('Грешка при изпращане на съобщението!');
          console.error(err);
      });
  }
}
