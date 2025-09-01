import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiService } from '../../services/api-service';
import { MatListModule } from "@angular/material/list";
import { AsyncPipe } from '@angular/common';
import { Software } from '../../models/software';
import { Branch as BranchObj } from '../../models/branch';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-branch',
  imports: [MatListModule, AsyncPipe, LoadingSpinner],
  templateUrl: './branch.html',
  styleUrl: './branch.scss',
})
export class Branch implements OnInit {
  branch?: BranchObj;
  systems$?: Observable<Software[]>;
  notifications$?: Observable<Notification[]>;
  constructor(private service: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.branch = history.state.branch;
    if (this.branch) {
      const branchId = this.branch.UniqueId;
      this.systems$ = this.service.getSystems(branchId)
        .pipe(catchError((err) => {
          console.log(err);
          return throwError(() => err);
        }));
      this.notifications$ = this.service.getBranchNotifications(branchId)
        .pipe(catchError((err) => {
          console.log(err);
          return throwError(() => err);
        }));
    }

  }
}
