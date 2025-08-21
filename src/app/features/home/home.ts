import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { ApiService } from '../../services/api-service';
import { catchError, Observable, of, pipe } from 'rxjs';
import { MatList, MatListModule } from "@angular/material/list";
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatList, MatListModule, MatProgressSpinnerModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  loading: boolean = true;
  restaurants?: Restaurant[];

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.service.getRestaurants().subscribe({
      next: data => {
        if (data) {
          console.log(data.length);
          this.restaurants = data;
          this.loading = false;
        }
      },
      error: err => {
        this.service.updateToken();
        this.loading = false;
        console.log(err);
      }
    });
  }
}
