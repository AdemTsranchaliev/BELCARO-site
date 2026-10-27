import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product, categoryLabel } from '../product.model';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: Product[] = [];
  categoryLabel = categoryLabel;

  private readonly destroy$ = new Subject<void>();

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.wishlistItems = items;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get countLabel(): string {
    const count = this.wishlistItems.length;
    return count === 1 ? '1 модел' : `${count} модела`;
  }

  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }

  trackById(_index: number, product: Product): string {
    return product.Id;
  }

  imageSrc(product: Product, size: '640' | '1000'): string {
    const name = (product.Image || product.Id || '').toLowerCase();
    if (size === '1000') {
      return `assets/images/products/${name}.1-1000.webp`;
    }
    return `assets/images/products-thumb/${name}.1-640.webp`;
  }
}
