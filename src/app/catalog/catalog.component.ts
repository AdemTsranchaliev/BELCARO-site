import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product.model';
import { CommonserviceService } from '../commonservice.service';
import { WishlistService } from '../wishlist.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit, AfterViewInit {
  // Products
  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public paginatedProducts: Product[] = [];
  public category: string = "";
  private destroy$ = new Subject<void>();

  // Pagination
  public currentPage: number = 1;
  public pageSize: number = 12;
  public totalPages: number = 1;

  // View Mode
  public viewMode: 'grid' | 'list' = 'grid';

  // Filters
  public showFilters: boolean = false;
  public activeFilters: string[] = [];
  public categories: string[] = [
    'Дивани',
    'Фотьойли',
    'Мека мебел',
    'Столове',
    'Легла',
    'Маси'
  ];
  public priceRange = {
    min: 0,
    max: 10000,
    current: 5000
  };

  selectedProduct: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: CommonserviceService,
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngAfterViewInit(): void {
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    combineLatest([this.service.GetProducts(), this.route.paramMap])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([products, pm]) => {
        this.products = products;
        this.category = (pm.get('category') ?? '').trim();
        window.scroll(0, 0);
  
        this.filterProducts();      // updates filteredProducts
        this.cdr.markForCheck();    // <-- tell OnPush to refresh
      });
  }
  
  ngOnDestroy(): void {
    // 👇 notify all observables to unsubscribe
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      if (this.category) {
        const categoryMatch = product.Category.toLowerCase() === this.category.toLowerCase();
        if (!categoryMatch) return false;
      }
      if (this.activeFilters.length > 0) {
        const categoryMatch = this.activeFilters.includes(product.Category);
        if (!categoryMatch) return false;
      }
      if (product.Price && (product.Price < this.priceRange.min || product.Price > this.priceRange.max)) {
        return false;
      }
      return true;
    });
  
    this.updatePagination();
    this.cdr.markForCheck(); // <-- ensure UI reflects new slice
  }
  

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.setPage(1);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
  
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  
    this.cdr.markForCheck(); // <-- refresh after slicing
    window.scroll(0, 300);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  isFilterActive(category: string): boolean {
    return this.activeFilters.includes(category);
  }

  trackByProductId(index: number, product: Product): string {
    return product.Id;
  }

  toggleCategoryFilter(category: string): void {
    const index = this.activeFilters.indexOf(category);
    if (index === -1) {
      this.activeFilters.push(category);
    } else {
      this.activeFilters.splice(index, 1);
    }
    this.filterProducts();
  }

  applyFilters(): void {
    this.filterProducts();
  }

  clearFilters(): void {
    this.activeFilters = [];
    this.priceRange = {
      min: 0,
      max: 10000,
      current: 5000
    };
    this.filterProducts();
  }

  quickView(product: Product): void {
    this.selectedProduct = product;
  }

  closeQuickView(): void {
    this.selectedProduct = null;
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
