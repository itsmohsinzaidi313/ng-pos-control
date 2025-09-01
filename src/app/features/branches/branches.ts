import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Branch } from '../../models/branch';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-branches',
  imports: [MatListModule, AsyncPipe, MatProgressSpinnerModule, RouterLink, LoadingSpinner],
  templateUrl: './branches.html',
  styleUrl: './branches.scss'
})
export class Branches {
  constructor(private service: ApiService, private route: ActivatedRoute) { }
  restaurant?: string;
  branches$?: Observable<Branch[] | null>;

  ngOnInit(): void {
    try {
      this.branches$ = this.route.paramMap.pipe(
        switchMap((params, index) => {
          let uniqueId = params.get('id');
          if (uniqueId) {
            return this.service.getBranches(uniqueId).pipe(
              catchError((err) => {
                if (err instanceof HttpErrorResponse && err.status == 401) {
                  // this.service.updateToken();
                  return of([]);
                }
                return throwError(() => err);
              }),
              map(e => {
                this.restaurant = e.at(0)?.Restaurant ?? '';
                return e;
              })
            );
          }
          return of(null);
        })
      );
    } catch (error) {

    }
  }
}
