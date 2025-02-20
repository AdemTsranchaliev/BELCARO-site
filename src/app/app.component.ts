import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  ngOnInit(): void {
    if (environment.production) {
      console.log('Running in production mode');
    }
    else {
      console.log("dev")
    }
  }

  closeMobileMenu() {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    if (closeButton) {
      (closeButton as HTMLElement).click(); // Simulate a click on the close button
    }
  }


  title = 'belcaro-site';
}
