import { Component, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
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
import { DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-systems',
  imports: [MatListModule, LoadingSpinner, MatSlideToggleModule, MatIconModule, MatExpansionModule, MatDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatTimepickerModule, DatePipe, MatInputModule, MatButtonModule],
  templateUrl: './systems.html',
  styleUrl: './systems.scss'
})
export class Systems {
  title = signal('')
  branch?: BranchObj;
  $systems = signal<Software[]>([]);
  $filteredSystems = signal<Software[]>([]);

  $notifications = signal<ClientNotification[]>([]);
  $filteredNotifications = signal<ClientNotification[]>([]);

  $loadingSoftwares = signal(true);
  $loadingNotifications = signal(true);

  formController = new FormControl('');

  constructor(private searchService: SearchService, private apiService: ApiService, private notificationService: NotificationService) {
    this.searchService.$search.subscribe(search => {
      const result2 = this.$systems().filter(val => val.UniqueId.toLowerCase().includes(search.toLowerCase()));
      this.$filteredSystems.set(result2);
    })
  }

  ngOnInit(): void {
    this.branch = history.state.branch;
    if (this.branch) {
      this.title.set(this.branch.Name);
      const branchId = this.branch.UniqueId;
      this.$loadingSoftwares.set(true);
      this.apiService.getSoftwares(branchId)
        .pipe(catchError((err) => {
          console.log(err);
          return [];
        }))
        .subscribe(response => {
          this.$systems.set(response);
          this.$filteredSystems.set(response);

        });
      this.apiService.getBranchNotifications(branchId)
        .pipe(catchError((err) => {
          console.log(err);
          return []
        }))
        .subscribe(response => {
          this.$notifications.set(response);
          this.$filteredNotifications.set(response);
        });
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
        this.apiService.getSoftwares(this.branch!.UniqueId)
          .pipe(catchError(err => {
            console.log(err);
            return []
          }))
          .subscribe(response => {
            if (response.length >= 1) {
              const value = response.filter(x => x.UniqueId == software.UniqueId)
              $toggleChanged.source.checked = value[0].Enabled;
            }
          });
      });
  }


  onNotificationToggle($toggleChanged: MatSlideToggleChange, notification: ClientNotification) {
    $toggleChanged.source.checked = !$toggleChanged.source.checked;

    this.apiService.updateBranchNotification(this.branch!.UniqueId, {
      notificationId: notification.NotificationId,
      body: notification.Body,
      title: notification.Title,
      validity: notification.Validity,
      deleted: notification.Deleted,
      level: notification.Level,
      enabled: $toggleChanged.checked
    }, $toggleChanged.checked)
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
            }))
            .subscribe(response => {
              if (response.length >= 1) {
                const value = response.filter(x => x.NotificationId == notification.NotificationId)
                $toggleChanged.source.checked = value[0].Enabled;
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
