import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product.model';
import { CommonserviceService } from '../commonservice.service';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  // Products
  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public paginatedProducts: Product[] = [];
  public category: string = "";

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
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.products = this.service.GetProducts();
    this.route.params.subscribe(params => {
      if (params['category']) {
        this.category = params['category'];
        this.filterProducts();
      } else {
        this.filteredProducts = this.products;
        this.updatePagination();
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      // Category filter from URL
      if (this.category) {
        const categoryMatch = product.Category.toLowerCase() === this.category.toLowerCase();
        if (!categoryMatch) return false;
      }

      // Active filters
      if (this.activeFilters.length > 0) {
        const categoryMatch = this.activeFilters.includes(product.Category);
        if (!categoryMatch) return false;
      }

      // Price filter
      if (product.Price && (product.Price < this.priceRange.min || product.Price > this.priceRange.max)) {
        return false;
      }

      return true;
    });
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.setPage(1);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
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
