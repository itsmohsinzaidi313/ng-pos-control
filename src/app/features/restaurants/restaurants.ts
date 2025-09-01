import { Component, computed, OnInit, signal } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { ApiService } from '../../services/api-service';
import { Observable } from 'rxjs';
import { MatList, MatListModule } from "@angular/material/list";
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-restaurants',
  imports: [AsyncPipe, MatList, MatListModule, MatProgressSpinnerModule, MatRippleModule, RouterLink, LoadingSpinner],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss'
})
export class Restaurants {
  value$ = signal(0);
  restaurants$?: Observable<Restaurant[]>;

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.restaurants$ = this.service.getRestaurants();
  }

  increment(): void {
    this.value$.update((v) => v + 1);
  }
}
