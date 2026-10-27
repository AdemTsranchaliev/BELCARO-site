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
    try {
      const savedWishlist = localStorage.getItem(this.STORAGE_KEY);
      if (!savedWishlist) {
        return;
      }
      const parsed = JSON.parse(savedWishlist);
      if (!Array.isArray(parsed)) {
        return;
      }
      this.wishlistSubject.next(parsed.filter((item) => item && item.Id));
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
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
    const newWishlist = currentWishlist.filter(item => !this.sameId(item.Id, product.Id));
    this.saveWishlist(newWishlist);
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistSubject.value.some(item => this.sameId(item.Id, product.Id));
  }

  private sameId(left: string, right: string): boolean {
    return (left || '').toLowerCase() === (right || '').toLowerCase();
  }

  getWishlistCount(): number {
    return this.wishlistSubject.value.length;
  }

  clearWishlist(): void {
    this.saveWishlist([]);
  }
} 