import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import Swiper from "swiper";
import { Product, categoryLabel } from "../product.model";
import { CommonserviceService } from "../commonservice.service";
import { Subject, combineLatest } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { WishlistService } from '../wishlist.service';
import { SeoService } from '../seo.service';

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
  categoryLabel = categoryLabel;

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
    "assets/js/main.js",
    "assets/js/drift.min.js",
    "assets/js/model-viewer.min.js",
    "assets/js/zoom.js",
  ];

  private scriptElements: HTMLScriptElement[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CommonserviceService,
    private wishlistService: WishlistService,
    private seo: SeoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => window.scroll(0, 0));

    this.loadScripts();
    combineLatest([this.service.GetProducts(), this.route.paramMap])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([products, params]) => {
        this.products = products;

        const cat = params.get("id");
        const path = this.router.url.split("?")[0];
        if (cat) {
          const prod = this.products.find(
            (product) => product.Id?.toLowerCase() === cat?.toLowerCase()
          );
          if (prod) {
            this.productDetails = prod;
            this.relatedProducts = this.relatedFor(this.products, prod);
            this.seo.applyProductPage(prod, path);
          } else {
            this.relatedProducts = [];
            this.seo.apply({
              title: "Продуктът не е намерен",
              description:
                "Търсеният артикул липсва в каталога Belcaro. Разгледайте актуалните продукти.",
              canonicalPath: path,
              noIndex: true,
            });
          }
        } else {
          this.relatedProducts = [];
          this.seo.apply({
            title: "Продукт",
            description:
              "Детайли за продукт от каталога Belcaro — премиум мека мебел и интериор.",
            canonicalPath: path,
          });
        }
      });
  }

  ngAfterViewInit(): void {
    window.scroll(0, 0);

    const thumbsSwiper = new Swiper(".tf-product-media-thumbs", {
      direction: "horizontal",
      spaceBetween: 12,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        768: {
          slidesPerView: 5,
          spaceBetween: 14,
        },
      },
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

    this.mainSwiper.on("slideChange", () => {
      this.currentImage = this.mainSwiper?.activeIndex ?? 0;
      this.cdr.markForCheck();
    });

    setTimeout(() => {
      this.mainSwiper?.update();
      thumbsSwiper.update();
      this.mainSwiper?.slideTo(this.currentImage);
    }, 500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeScripts();
  }

  private loadScripts(): void {
    const moduleScripts = new Set(["assets/js/model-viewer.min.js", "assets/js/zoom.js"]);
    this.scriptUrls.forEach((url) => {
      const script = document.createElement("script");
      script.src = url;
      if (moduleScripts.has(url)) {
        script.type = "module";
      }
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

  private relatedFor(products: Product[], current: Product): Product[] {
    const id = current.Id?.toLowerCase();
    const category = current.Category?.toLowerCase();
    const others = products.filter((product) => product.Id?.toLowerCase() !== id);
    const same = category
      ? others.filter((product) => product.Category?.toLowerCase() === category)
      : [];
    const rest = others.filter(
      (product) => product.Category?.toLowerCase() !== category
    );
    return [...same, ...rest].slice(0, 3);
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

  frameNo(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
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
