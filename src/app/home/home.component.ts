import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private scriptUrls = [
    'assets/js/jquery.min.js',
    'assets/js/bootstrap.min.js',
    'assets/js/swiper-bundle.min.js',
    'assets/js/carousel.js',
    'assets/js/bootstrap-select.min.js',
    'assets/js/lazysize.min.js',
    'assets/js/count-down.js',
    'assets/js/wow.min.js',
    'assets/js/multiple-modal.js',
    'assets/js/nouislider.min.js',
    'assets/js/shop.js',
    'assets/js/main.js'
  ];

  private scriptElements: HTMLScriptElement[] = [];

  ngOnInit() {
    this.loadScripts();
  }

  ngOnDestroy() {
    this.removeScripts();
  }

  private loadScripts() {
    this.scriptUrls.forEach(url => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      this.scriptElements.push(script);
    });
  }

  private removeScripts() {
    this.scriptElements.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    this.scriptElements = [];
  }

  constructor() { }

}
