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
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-branches',
  imports: [MatListModule, AsyncPipe, MatProgressSpinnerModule, RouterLink, LoadingSpinner],
  templateUrl: './branches.html',
  styleUrl: './branches.scss'
})
export class Branches {
  restaurant?: string;
  branches$?: Observable<Branch[] | null>;
  filteredBranches$?: Observable<Branch[] | null>;
  constructor(private searchService: SearchService, private apiService: ApiService, private route: ActivatedRoute) {
    this.searchService.$search.subscribe(search =>
      this.filteredBranches$ = this.branches$?.pipe(map(b => {
        return (b ?? []).filter(val => val.Name.toLowerCase().includes(search.toLowerCase()));
      }))
    );
  }

  ngOnInit(): void {
    try {
      let result = this.route.paramMap.pipe(
        switchMap((params, index) => {
          let uniqueId = params.get('id');
          if (uniqueId) {
            return this.apiService.getBranches(uniqueId).pipe(
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
      this.branches$ = result;
      this.filteredBranches$ = result;
    } catch (error) {

    }
  }
}
