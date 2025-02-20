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
  public fitleredProducts: Product[] = [];

  private scriptElements: HTMLScriptElement[] = [];
  constructor(private route: ActivatedRoute, private service: CommonserviceService) { }

  ngOnInit() {
    this.loadScripts();
    this.products = this.service.GetProducts();
    this.route.paramMap.subscribe(params => {
      var cat = params.get('category');


      if(cat)
      {
        if(cat?.toLowerCase()=="sofas"){
          this.category = "Дивани"
        }else if(cat?.toLowerCase()=="table"){
          this.category = "Маси"
  
        }else if(cat?.toLowerCase()=="beds"){
          this.category = "Спални"
          
        }else if(cat?.toLowerCase()=="UPHOLSTERED_CHAIRS".toLowerCase()){
          this.category = "Столове"
          
        }
        this.fitleredProducts =  this.products.filter(product => product.Category?.toLowerCase() === cat?.toLowerCase());
      }
      else{
        this.category = "Продукти"
        this.fitleredProducts = this.products;
      }
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


}

