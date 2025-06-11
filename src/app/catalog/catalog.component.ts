import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product.model';
import { CommonserviceService } from '../commonservice.service';

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
    private service: CommonserviceService
  ) { }

  ngOnInit() {
    this.products = this.service.GetProducts();
    this.filteredProducts = [...this.products];
    this.initializeCategories();
    
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      if (cat) {
        this.category = this.getCategoryName(cat);
        this.filterProducts();
      } else {
        this.category = "Продукти";
        this.filteredProducts = this.products;
      }
      this.updatePagination();
    });
  }

  // View Controls
  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  // Filter Controls
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  initializeCategories() {
    this.categories = [...new Set(this.products.map(p => p.Category || ''))];
  }

  isFilterActive(category: string): boolean {
    return this.activeFilters.includes(category);
  }

  toggleCategoryFilter(category: string) {
    const index = this.activeFilters.indexOf(category);
    if (index === -1) {
      this.activeFilters.push(category);
    } else {
      this.activeFilters.splice(index, 1);
    }
    this.applyFilters();
  }

  removeFilter(filter: string) {
    const index = this.activeFilters.indexOf(filter);
    if (index > -1) {
      this.activeFilters.splice(index, 1);
      this.filterProducts();
    }
  }

  updatePriceFilter() {
    this.filterProducts();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Category filter
      if (this.route.snapshot.paramMap.get('category')) {
        const categoryMatch = product.Category?.toLowerCase() === 
          this.route.snapshot.paramMap.get('category')?.toLowerCase();
        if (!categoryMatch) return false;
      }

      // Active filters
      if (this.activeFilters.length > 0) {
        const categoryMatch = this.activeFilters.includes(product.Category || '');
        if (!categoryMatch) return false;
      }

      // Price filter (assuming product has a price property)
      if (product.Price && (product.Price < this.priceRange.min || product.Price > this.priceRange.max)) {
        return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters() {
    this.activeFilters = [];
    this.priceRange = {
      min: 0,
      max: 10000,
      current: 5000
    };
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
    this.updatePagination();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      // Category filter
      if (this.route.snapshot.paramMap.get('category')) {
        const categoryMatch = product.Category?.toLowerCase() === 
          this.route.snapshot.paramMap.get('category')?.toLowerCase();
        if (!categoryMatch) return false;
      }

      // Active filters
      if (this.activeFilters.length > 0) {
        const categoryMatch = this.activeFilters.includes(product.Category || '');
        if (!categoryMatch) return false;
      }

      // Price filter (assuming product has a price property)
      if (product.Price && (product.Price < this.priceRange.min || product.Price > this.priceRange.max)) {
        return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination Controls
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProducts();
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Product Actions
  quickView(product: Product) {
    this.selectedProduct = product;
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeQuickView() {
    this.selectedProduct = null;
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  }

  addToFavorites(product: Product) {
    // Implement add to favorites functionality
    console.log('Add to favorites:', product);
  }

  private getCategoryName(cat: string): string {
    switch (cat.toLowerCase()) {
      case 'sofas': return 'Дивани';
      case 'tables': return 'Маси';
      case 'beds': return 'Спални';
      case 'chairs': return 'Столове';
      case 'armchair': return 'Фотьойли';
      default: return 'Продукти';
    }
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // If total pages is less than or equal to max visible pages, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Adjust start and end to always show 3 pages in the middle
      if (this.currentPage <= 2) {
        end = 4;
      } else if (this.currentPage >= this.totalPages - 1) {
        start = this.totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < this.totalPages - 1) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Always show last page
      pageNumbers.push(this.totalPages);
    }
    
    return pageNumbers;
  }
}
