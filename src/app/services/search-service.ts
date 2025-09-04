import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private available = new BehaviorSubject<boolean>(true);
  available$ = this.available.asObservable();

  private search = new BehaviorSubject<string>('');
  $search = this.search.asObservable();

  enableTags = new BehaviorSubject<boolean>(false);
  enableTags$ = this.enableTags.asObservable();

  setSearch(value: string): void {
    this.search.next(value);
  }

  enable(): void {
    this.available.next(true);
  }

  disable(): void {
    this.available.next(false);
  }

  clear(): void {
    this.search.next('');
  }
}
