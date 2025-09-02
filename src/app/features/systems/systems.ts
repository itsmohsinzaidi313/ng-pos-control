import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ApiService } from '../../services/api-service';
import { MatListModule } from "@angular/material/list";
import { AsyncPipe } from '@angular/common';
import { Software } from '../../models/software';
import { Branch as BranchObj } from '../../models/branch';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { SearchService } from '../../services/search-service';


@Component({
  selector: 'app-systems',
  imports: [MatListModule, AsyncPipe, LoadingSpinner],
  templateUrl: './systems.html',
  styleUrl: './systems.scss'
})
export class Systems {
  branch?: BranchObj;
  systems$?: Observable<Software[]>;
  filteredSystems?: Observable<Software[]>;
  notifications$?: Observable<Notification[]>;
  filteredNotifications$?: Observable<Notification[]>;
  constructor(private searchService: SearchService, private apiService: ApiService, private router: Router) {
    this.searchService.search$.subscribe(search => {
      this.filteredSystems = this.systems$?.pipe(map(value => {
        return (value ?? []).filter(val => val.UniqueId.toLowerCase().includes(search.toLowerCase()));
      }))
    })
  }

  ngOnInit(): void {
    this.branch = history.state.branch;
    if (this.branch) {
      const branchId = this.branch.UniqueId;
      const result1 = this.apiService.getSystems(branchId)
        .pipe(catchError((err) => {
          console.log(err);
          return throwError(() => err);
        }));
      this.systems$ = result1;
      this.filteredSystems = result1;

      const result2 = this.apiService.getBranchNotifications(branchId)
        .pipe(catchError((err) => {
          console.log(err);
          return throwError(() => err);
        }));
      this.notifications$ = result2;
      this.filteredNotifications$ = result2;
    }
  }
}
