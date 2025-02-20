import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import Swiper from "swiper";
import { Product } from "../product.model";
import { CommonserviceService } from "../commonservice.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public mainSwiper: any = null;
  public currentImage: number = 0;
  public products: Product[] = [];
  public relatedProducts: Product[] = [];

  private scriptUrls = [
    "assets/js/jquery.min.js",
    "assets/js/bootstrap.min.js",
    "assets/js/swiper-bundle.min.js",
    "assets/js/carousel.js",
    "assets/js/bootstrap-select.min.js",
    "assets/js/lazysize.min.js",
    "assets/js/count-down.js",
    "assets/js/wow.min.js",
    "assets/js/multiple-modal.js",
    "assets/js/nouislider.min.js",
    "assets/js/shop.js",
    "assets/js/main.js",
    "assets/js/drift.min.js",
    "assets/js/model-viewer.min.js",
    "assets/js/zoom.js",
  ];

  ngAfterViewInit() {
    window.scroll(0, 0);
    const thumbsSwiper = new Swiper(".tf-product-media-thumbs", {
      direction: "vertical",
      spaceBetween: 10,
      slidesPerView: "auto",
      freeMode: true,
      watchSlidesProgress: true,
    });

    this.mainSwiper = new Swiper(".tf-product-media-main", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".thumbs-next",
        prevEl: ".thumbs-prev",
      },
      thumbs: {
        swiper: thumbsSwiper,
      },
    });
    // Ensure Swiper updates after Angular renders
    setTimeout(() => {
      this.mainSwiper.update();
      thumbsSwiper.update();
      this.mainSwiper.slideTo(this.currentImage); // Reset to first image on load
    }, 500);
  }

  public nextImage() {
    this.currentImage++;
    if (this.productDetails.ImageCount <= this.currentImage) {
      this.currentImage = 0;
    }
    this.mainSwiper.slideTo(this.currentImage);
  }

  public prevImage() {
    this.currentImage--;
    if (0 > this.currentImage) {
      this.currentImage = this.productDetails.ImageCount - 1;
    }
    this.mainSwiper.slideTo(this.currentImage);
  }

  public openImage(num: number) {
    this.currentImage = num;
    this.mainSwiper.slideTo(this.currentImage);
  }

  public productDetails: Product = new Product("", "", "", "", 0, "");

  private scriptElements: HTMLScriptElement[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CommonserviceService
  ) { }

  getRandomProducts(products: Product[], count: number): Product[] {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scroll(0, 0);
      });

    this.loadScripts();
    this.products = this.service.GetProducts();

    this.relatedProducts = this.getRandomProducts(this.products, 4);

    this.route.paramMap.subscribe((params) => {
      var cat = params.get("id");
      if (cat) {
        var prod = this.products.filter(
          (product) => product.Id?.toLowerCase() === cat?.toLowerCase()
        );
        if (prod && prod.length > 0) {
          this.productDetails = prod[0];
        }
      } else {
      }
    });
  }

  ngOnDestroy() {
    this.removeScripts();
  }

  private loadScripts() {
    this.scriptUrls.forEach((url) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      this.scriptElements.push(script);
    });
  }

  private removeScripts() {
    this.scriptElements.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    this.scriptElements = [];
  }

  generateArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}
