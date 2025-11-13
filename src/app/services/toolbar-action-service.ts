import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class ToolbarActionService {

  constructor(private storageService: StorageService) {
    this.isLoggedIn.next(this.storageService.getLoginStatus());
    this.menuButtonEnabled.next(this.storageService.getLoginStatus());
    this.searchEnabled.next(this.storageService.getSearchEnabled());
  }
  triggerLogoutAction() {
    throw new Error('Method not implemented.');
  }

  triggerMenuAction() {
    throw new Error('Method not implemented.');
  }
  triggerAddAction() {
    throw new Error('Method not implemented.');
  }
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  $isLoggedIn = this.isLoggedIn.asObservable();

  private menuButtonEnabled = new BehaviorSubject<boolean>(false);
  $menuButtonEnabled = this.menuButtonEnabled.asObservable();

  private searchEnabled = new BehaviorSubject<boolean>(false);
  $searchEnabled = this.searchEnabled.asObservable();

  private search = new BehaviorSubject<string>('');
  $search = this.search.asObservable();

  enableMenuButton(): void {
    let value = true;
    this.menuButtonEnabled.next(value);
    this.storageService.setLoginStatus(value);
  }

  disableMenuButton(): void {
    let value = false;
    this.menuButtonEnabled.next(value);
    this.storageService.setLoginStatus(value);
  }

  enableSearch(): void {
    let value = true;
    this.searchEnabled.next(value);
    this.storageService.setSearchEnabled(value);
  }

  disableSearch(): void {
    let value = false;
    this.searchEnabled.next(value);
    this.storageService.setSearchEnabled(value);
  }

  setSearch(value: string): void {
    this.search.next(value);
  }

  clear(): void {
    this.search.next('');
  }
}
