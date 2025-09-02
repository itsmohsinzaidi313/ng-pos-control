import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private search = new BehaviorSubject<string>('');
  search$ = this.search.asObservable();
  
  enableTags = new BehaviorSubject<boolean>(false);
  enableTags$ = this.enableTags.asObservable();

  setSearch(value: string): void {
    this.search.next(value);
  }
}
