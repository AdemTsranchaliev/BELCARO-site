import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'wishlist';
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    const savedWishlist = localStorage.getItem(this.STORAGE_KEY);
    if (savedWishlist) {
      this.wishlistSubject.next(JSON.parse(savedWishlist));
    }
  }

  private saveWishlist(wishlist: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wishlist));
    this.wishlistSubject.next(wishlist);
  }

  addToWishlist(product: Product): void {
    const currentWishlist = this.wishlistSubject.value;
    if (!this.isInWishlist(product)) {
      const newWishlist = [...currentWishlist, product];
      this.saveWishlist(newWishlist);
    }
  }

  removeFromWishlist(product: Product): void {
    const currentWishlist = this.wishlistSubject.value;
    const newWishlist = currentWishlist.filter(item => item.Id !== product.Id);
    this.saveWishlist(newWishlist);
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistSubject.value.some(item => item.Id === product.Id);
  }

  getWishlistCount(): number {
    return this.wishlistSubject.value.length;
  }

  clearWishlist(): void {
    this.saveWishlist([]);
  }
} 