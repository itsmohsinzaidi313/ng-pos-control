import { Component, signal } from '@angular/core';
import { catchError, filter, map, Observable, of } from 'rxjs';
import { ApiService } from '../../services/api-service';
import { MatListModule } from "@angular/material/list";
import { Software } from '../../models/software';
import { Branch as BranchObj } from '../../models/branch';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { SearchService } from '../../services/search-service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ClientNotification } from '../../models/client-notification';
import { MatExpansionModule } from '@angular/material/expansion';
import { NotificationService } from '../../services/notification-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTimepickerModule } from '@angular/material/timepicker';
import { AsyncPipe, DatePipe, NgStyle } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-systems',
  imports: [MatListModule, LoadingSpinner, MatSlideToggleModule, MatIconModule, MatExpansionModule, MatDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatTimepickerModule, DatePipe, MatInputModule, MatButtonModule, NgStyle, AsyncPipe],
  templateUrl: './systems.html',
  styleUrl: './systems.scss'
})
export class Systems {
  title = signal('')
  branch?: BranchObj;
  // $systems = signal<Software[]>([]);
  // $filteredSystems = signal<Software[]>([]);
  $systems?: Observable<Software[]>;
  $filteredSystems?: Observable<Software[]>;

  // $notifications = signal<ClientNotification[]>([]);
  // $filteredNotifications = signal<ClientNotification[]>([]);
  $notifications?: Observable<ClientNotification[]>;
  $filteredNotifications?: Observable<ClientNotification[]>;

  $loadingSoftwares = signal(true);
  $loadingNotifications = signal(true);

  formController = new FormControl('');

  constructor(private searchService: SearchService, private apiService: ApiService, private notificationService: NotificationService) {
    this.searchService.$search.subscribe(search => {
      this.$filteredSystems = this.$systems?.pipe(
        map(list => list.filter(val => val.UniqueId.toLowerCase().includes(search.toLowerCase())))
      );
    })
  }

  ngOnInit(): void {
    this.branch = history.state.branch;
    if (this.branch) {
      this.title.set(this.branch.Name);
      const branchId = this.branch.UniqueId;
      this.$loadingSoftwares.set(true);
      const response1 = this.apiService.getSoftwares(branchId)
        .pipe(catchError((err) => {
          console.log(err);
          return [];
        }));
      this.$filteredSystems = response1;
      this.$systems = response1;
      const response2 = this.apiService.getBranchNotifications(branchId)
        .pipe(catchError((err) => {
          console.log(err);
          return []
        }));
      this.$filteredNotifications = response2;
      this.$notifications = response2;
    }
  }

  onSoftwareToggle($toggleChanged: MatSlideToggleChange, software: Software): void {
    $toggleChanged.source.checked = !$toggleChanged.source.checked;
    this.apiService.updateSoftware(software.UniqueId, $toggleChanged.checked)
      .pipe(catchError(err => {
        console.log(err);
        return of(false);
      }))
      .subscribe(_ => {
        const response = this.apiService.getSoftwares(this.branch!.UniqueId)
          .pipe(catchError(err => {
            console.log(err);
            return []
          }));
        this.$systems = response;
        this.$filteredSystems = response;
      });
  }


  onNotificationToggle($toggleChanged: MatSlideToggleChange, notification: ClientNotification) {
    $toggleChanged.source.checked = !$toggleChanged.source.checked;

    this.apiService.updateBranchNotification(this.branch!.UniqueId, notification, { enabled: $toggleChanged.checked })
      .pipe(catchError(err => {
        console.log(err);
        this.notificationService.showMessage(err.message);
        return of(false)
      }))
      .subscribe(response1 => {
        if (response1) {
          const respone2 = this.apiService.getBranchNotifications(this.branch!.UniqueId)
            .pipe(catchError(err => {
              console.log(err);
              return of([]);
            }));
          this.$filteredNotifications = respone2;
          this.$notifications = respone2;
        }
      });
  }

  copyToClipboard(value: string): void {
    navigator.clipboard.writeText(value);
    this.notificationService.showMessage('Copied', 1000)
  }
}
