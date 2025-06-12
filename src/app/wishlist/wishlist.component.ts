import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }
} 