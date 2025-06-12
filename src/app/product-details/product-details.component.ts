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
import { WishlistService } from '../wishlist.service';

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public mainSwiper: Swiper | null = null;
  public currentImage: number = 0;
  public products: Product[] = [];
  public relatedProducts: Product[] = [];
  public productDetails: Product = new Product("", "", "", "", 0, "");

  private readonly scriptUrls = [
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

  private scriptElements: HTMLScriptElement[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CommonserviceService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => window.scroll(0, 0));

    this.loadScripts();
    this.products = this.service.GetProducts();
    this.relatedProducts = this.getRandomProducts(this.products, 4);

    this.route.paramMap.subscribe((params) => {
      const cat = params.get("id");
      if (cat) {
        const prod = this.products.find(
          (product) => product.Id?.toLowerCase() === cat?.toLowerCase()
        );
        if (prod) {
          this.productDetails = prod;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    window.scroll(0, 0);

    const thumbsSwiper = new Swiper(".tf-product-media-thumbs", {
      direction: window.innerWidth >= 768 ? 'vertical' : 'horizontal',
      spaceBetween: 10,
      slidesPerView: window.innerWidth >= 768 ? 'auto' : 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        768: {
          direction: 'vertical',
          slidesPerView: 'auto'
        }
      }
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
      breakpoints: {
        320: {
          allowTouchMove: true,
        }
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      const isDesktop = window.innerWidth >= 768;
      thumbsSwiper.params.direction = isDesktop ? 'vertical' : 'horizontal';
      thumbsSwiper.update();
    });

    setTimeout(() => {
      this.mainSwiper?.update();
      thumbsSwiper.update();
      this.mainSwiper?.slideTo(this.currentImage);
    }, 500);
  }

  ngOnDestroy(): void {
    this.removeScripts();
  }

  private loadScripts(): void {
    this.scriptUrls.forEach((url) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      this.scriptElements.push(script);
    });
  }

  private removeScripts(): void {
    this.scriptElements.forEach((script) => {
      script.parentNode?.removeChild(script);
    });
    this.scriptElements = [];
  }

  getRandomProducts(products: Product[], count: number): Product[] {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, count);
  }

  public nextImage(): void {
    this.currentImage = (this.currentImage + 1) % this.productDetails.ImageCount;
    this.mainSwiper?.slideTo(this.currentImage);
  }

  public prevImage(): void {
    this.currentImage =
      this.currentImage === 0
        ? this.productDetails.ImageCount - 1
        : this.currentImage - 1;
    this.mainSwiper?.slideTo(this.currentImage);
  }

  public openImage(num: number): void {
    this.currentImage = num;
    this.mainSwiper?.slideTo(this.currentImage);
  }

  generateArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  addToFavorites(product: Product): void {
    if (this.wishlistService.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(product);
    } else {
      this.wishlistService.addToWishlist(product);
    }
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistService.isInWishlist(product);
  }
}
