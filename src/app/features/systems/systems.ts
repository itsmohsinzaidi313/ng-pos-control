import { Component, signal } from '@angular/core';
import { catchError, map, of, throwError } from 'rxjs';
import { ApiService } from '../../services/api-service';
import { MatListModule } from "@angular/material/list";
import { AsyncPipe } from '@angular/common';
import { Software } from '../../models/software';
import { Branch as BranchObj } from '../../models/branch';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { SearchService } from '../../services/search-service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ClientNotification } from '../../models/client-notification';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-systems',
  imports: [MatListModule, AsyncPipe, LoadingSpinner, MatSlideToggleModule, MatIconModule, MatExpansionModule],
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

  constructor(private searchService: SearchService, private apiService: ApiService) {
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
    this.apiService.updateBranchNotification(this.branch!.UniqueId, notification, $toggleChanged.checked)
      .pipe(catchError(err => {
        console.log(err)
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
                const value = response.filter(x => x.Id == notification.Id)
                $toggleChanged.source.checked = value[0].Enabled;
              }
            });
        }
      });
  }
}
