import { Component, signal } from '@angular/core';
import { catchError, filter, map, Observable, of } from 'rxjs';
import { ApiService } from '../../services/api-service';
import { MatListModule } from "@angular/material/list";
import { Software } from '../../models/software';
import { Branch as BranchObj } from '../../models/branch';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { SearchService } from '../../services/search-service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ClientNotification } from '../../models/client-notification';
import { MatExpansionModule } from '@angular/material/expansion';
import { NotificationService } from '../../services/notification-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTimepickerModule } from '@angular/material/timepicker';
import { AsyncPipe, DatePipe, NgStyle } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-systems',
  imports: [MatListModule, LoadingSpinner, MatSlideToggleModule, MatIconModule, MatExpansionModule, MatDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatTimepickerModule, MatInputModule, MatButtonModule, AsyncPipe],
  templateUrl: './systems.html',
  styleUrl: './systems.scss'
})
export class Systems {
  title = signal('')
  branch?: BranchObj;

  $systems?: Observable<Software[]>;
  $filteredSystems?: Observable<Software[]>;

  $notifications?: Observable<ClientNotification[]>;
  $filteredNotifications?: Observable<ClientNotification[]>;

  $loadingSoftwares = signal(true);
  $loadingNotifications = signal(true);

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
          this.apiService.getBranchNotifications(this.branch!.UniqueId)
            .pipe(catchError(err => {
              console.log(err);
              return of([]);
            })).subscribe(values => {
              if (values) {
                const x = values.filter(e => e.NotificationId === notification.NotificationId);
                if (x) {
                  const enabled = x.at(0)!.Enabled;
                  $toggleChanged.source.checked = enabled;
                }
              }
            });
        }
      });
  }

  onUndoPressed($event: MouseEvent, datetimeinput: HTMLInputElement, notification: ClientNotification) {
    datetimeinput.value = notification.Validity!.toString();
  }


  onSavePressed($event: MouseEvent, datetimeinput: HTMLInputElement, notification: ClientNotification) {
    this.apiService.updateBranchNotification(this.branch!.UniqueId, notification, { validity: new Date(datetimeinput.value) }).pipe(catchError(err => {
      console.log(err);
      this.notificationService.showMessage(err.message);
      return of(false)
    }))
      .subscribe(response1 => {
        if (response1) {
          this.apiService.getBranchNotifications(this.branch!.UniqueId)
            .pipe(catchError(err => {
              console.log(err);
              return of([]);
            })).subscribe(values => {
              if (values) {
                const x = values.filter(e => e.NotificationId === notification.NotificationId);
                if (x) {
                  this.notificationService.showMessage('Validity Updated', 1000)
                  datetimeinput.value = x.at(0)!.Validity!.toString();
                }
              }
            });
        }
      });
  }

  copyToClipboard(value: string): void {
    navigator.clipboard.writeText(value);
    this.notificationService.showMessage('Copied', 1000)
  }
}
