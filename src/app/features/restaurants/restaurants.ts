import { Component, computed, OnInit, signal } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { ApiService } from '../../services/api-service';
import { map, Observable, of } from 'rxjs';
import { MatList, MatListModule } from "@angular/material/list";
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-restaurants',
  imports: [AsyncPipe, MatList, MatListModule, MatProgressSpinnerModule, MatRippleModule, RouterLink, LoadingSpinner, MatInputModule, ReactiveFormsModule],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss'
})
export class Restaurants {
  value$ = signal(0);
  restaurants$?: Observable<Restaurant[]>;
  filteredItems$?: Observable<Restaurant[]>;

  constructor(private searchService: SearchService, private apiService: ApiService) {
    this.searchService.enable();
    this.searchService.search$.subscribe((search) => {
      this.filteredItems$ = this.restaurants$?.pipe(map((r) => {
        return r.filter((value2, index) => {
          return value2.Name.toLowerCase().includes(search.toLowerCase())
        })
      }))
    });
  }

  ngOnInit(): void {
    this.restaurants$ = this.apiService.getRestaurants();
    this.filteredItems$ = this.restaurants$;
  }

  increment(): void {
    this.value$.update((v) => v + 1);
  }
}
