import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product.model';
import { CommonserviceService } from '../commonservice.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {

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

  public products: Product[] = [];
  public category: string = "";
  public filteredProducts: Product[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  
  private scriptElements: HTMLScriptElement[] = [];
  
  constructor(private route: ActivatedRoute, private service: CommonserviceService) { }

  ngOnInit() {
    this.loadScripts();
    this.products = this.service.GetProducts();
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category');
      
      if (cat) {
        this.category = this.getCategoryName(cat);
        this.filteredProducts = this.products.filter(product => product.Category?.toLowerCase() === cat?.toLowerCase());
      } else {
        this.category = "Продукти";
        this.filteredProducts = this.products;
      }
      this.currentPage = 1;
    });
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

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
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

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  private getCategoryName(cat: string): string {
    switch (cat.toLowerCase()) {
      case 'sofas': return 'Дивани';
      case 'table': return 'Маси';
      case 'beds': return 'Спални';
      case 'upholstered_chairs': return 'Столове';
      default: return 'Продукти';
    }
  }
}
