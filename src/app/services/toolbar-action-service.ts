import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolbarActionService {
  triggerLogoutAction() {
    throw new Error('Method not implemented.');
  }
  triggerMenuAction() {
    throw new Error('Method not implemented.');
  }
  triggerAddAction() {
    throw new Error('Method not implemented.');
  }
  private menuButtonEnabled = new BehaviorSubject<boolean>(false);
  $menuButtonEnabled = this.menuButtonEnabled.asObservable();

  private searchEnabled = new BehaviorSubject<boolean>(false);
  $searchEnabled = this.searchEnabled.asObservable();

  private search = new BehaviorSubject<string>('');
  $search = this.search.asObservable();

  enableMenuButton(): void {
    this.menuButtonEnabled.next(true);
  }

  disableMenuButton(): void {
    this.menuButtonEnabled.next(false);
  }

  enableSearch(): void {
    this.searchEnabled.next(true);
  }

  disableSearch(): void {
    this.searchEnabled.next(false);
  }
  
  setSearch(value: string): void {
    this.search.next(value);
  }

  clear(): void {
    this.search.next('');
  }
}
