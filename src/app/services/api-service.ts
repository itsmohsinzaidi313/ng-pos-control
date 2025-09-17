import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/login-response';
import { Restaurant } from '../models/restaurant';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { Branch } from '../models/branch';
import { Software } from '../models/software';
import { ClientNotification } from '../models/client-notification';
import { validate } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly DEVICEID = '321661E0-9874-11EE-BBE0-9F04E8D08641';
  private readonly BASE_URL = 'http://localhost:5004/api/v2/';
  private readonly SECURITY_URL = `${this.BASE_URL}Security/`;
  private readonly REGISTRATION_URL = `${this.BASE_URL}Registration/`;

  constructor(private client: HttpClient) { }

  login(hashedUsername: string, hashedPassword: string): Observable<boolean> {
    var requestBody = {
      Username: hashedUsername,
      Passphrase: hashedPassword,
      DeviceId: this.DEVICEID,
    };
    const url = `${this.SECURITY_URL}AppAuth`;

    return this.client.post<LoginResponse>(url, requestBody, { observe: 'response' })
      .pipe(
        switchMap((response, index) => {
          if (response.ok) {
            var body = response.body!;
            localStorage.setItem('token', body.token);
            localStorage.setItem('username', hashedUsername);
            localStorage.setItem('password', hashedPassword);
          }
          return of(response);
        }),
        map((value) => value.ok)
      );
  }

  updateToken(): Observable<boolean> {
    const hashedUsername = localStorage.getItem('username')!;
    const hashedPassword = localStorage.getItem('password')!;
    return this.login(hashedUsername, hashedPassword);
  }

  getRestaurants(): Observable<Restaurant[]> {
    const url = `${this.REGISTRATION_URL}Restaurants`
    return this.client.get<Restaurant[]>(url);
  }

  getBranches(uniqueId: string): Observable<Branch[]> {
    const params = new HttpParams()
      .set('restaurantId', uniqueId);
    const url = `${this.REGISTRATION_URL}Branch`
    return this.client.get<Branch[]>(url, { params: params });
  }

  getSoftwares(uniqueId: string): Observable<Software[]> {
    const params = new HttpParams()
      .set('branchId', uniqueId);
    const url = `${this.REGISTRATION_URL}Softwares`
    return this.client.get<Software[]>(url, { params: params });
  }

  getBranchNotifications(uniqueId: string): Observable<ClientNotification[]> {
    const params = new HttpParams()
      .set('branchId', uniqueId);
    const url = `${this.REGISTRATION_URL}BranchNotifications`
    return this.client.get<ClientNotification[]>(url, { params: params });
  }

  getUserNotifications(uniqueId: string): Observable<ClientNotification[]> {
    const params = new HttpParams()
      .set('userId', uniqueId);
    const url = `${this.REGISTRATION_URL}UserNotifications`
    return this.client.get<ClientNotification[]>(url, { params: params });
  }

  updateSoftware(uniqueId: string, value: boolean): Observable<boolean> {
    const url = `${this.REGISTRATION_URL}Softwares`;
    return this.client.put(url, null, {
      params: {
        'softwareId': uniqueId,
        'enabled': value
      },
      observe: 'response'
    }).pipe(map(response => {
      return response.ok;
    }));
  }


  updateBranchNotification(uniqueId: string, notification: ClientNotification, { level, title, body, enabled, validity, deleted, }: { level?: number, title?: string, body?: string, enabled?: boolean, validity?: Date, deleted?: boolean }): Observable<boolean> {
    const url = `${this.REGISTRATION_URL}BranchNotification`;
    return this.client.put(url, {
      Id: notification.NotificationId,
      Level: level ?? notification.Level,
      Title: title ?? notification.Title,
      Message: body ?? notification.Body,
      Enabled: enabled ?? notification.Enabled,
      Validity: validity ?? notification.Validity,
      Deleted: deleted ?? notification.Deleted,
      Uids: [uniqueId]
    }, {
      observe: 'response'
    }).pipe(map(response => {
      return response.ok;
    }));
  }
}
