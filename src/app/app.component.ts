import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { WishlistService } from './wishlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'belcaro-site';

  constructor(public wishlistService: WishlistService) {}

  ngOnInit(): void {
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
}
