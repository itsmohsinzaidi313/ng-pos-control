import { Component, computed, OnInit, signal } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { ApiService } from '../../services/api-service';
import { filter, map, Observable, of, startWith, subscribeOn } from 'rxjs';
import { MatList, MatListModule } from "@angular/material/list";
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurants',
  imports: [AsyncPipe, MatList, MatListModule, MatProgressSpinnerModule, MatRippleModule, RouterLink, LoadingSpinner, MatInput, MatInputModule, ReactiveFormsModule],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss'
})
export class Restaurants {
  value$ = signal(0);
  restaurants$?: Observable<Restaurant[]>;
  formControl = new FormControl('');
  filteredItems$?: Observable<Restaurant[]>;

  constructor(private service: ApiService) {
    this.formControl.valueChanges.subscribe((search) => {
      this.filteredItems$ = this.restaurants$?.pipe(map((r) => {
        return r.filter((value2, index) => {
          if (search)
            return value2.Name.toLowerCase().includes(search.toLowerCase())
          return of([]);
        })
      }))
    });
  }

  ngOnInit(): void {
    this.restaurants$ = this.service.getRestaurants();
    this.filteredItems$ = this.restaurants$;
  }

  increment(): void {
    this.value$.update((v) => v + 1);
  }
}
