import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

setLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }

  getLoginStatus(): boolean {
    const status = localStorage.getItem('isLoggedIn');
    return status ? JSON.parse(status) : false;
  }

  setSearchEnabled(isEnabled: boolean): void {
    localStorage.setItem('searchEnabled', JSON.stringify(isEnabled));
  }

  getSearchEnabled(): boolean {
    const status = localStorage.getItem('searchEnabled');
    return status ? JSON.parse(status) : false;
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }  
}
