import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/login-response';
import { Restaurant } from '../models/restaurant';
import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { Branch } from '../models/branch';
import { Software } from '../models/software';

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

  getSystems(uniqueId: string): Observable<Software[]> {
    const params = new HttpParams()
      .set('branchId', uniqueId);
    const url = `${this.REGISTRATION_URL}Softwares`
    return this.client.get<Software[]>(url, { params: params });
  }

  getBranchNotifications(uniqueId: string): Observable<Notification[]> {
    const params = new HttpParams()
      .set('branchId', uniqueId);
    const url = `${this.REGISTRATION_URL}BranchNotifications`
    return this.client.get<Notification[]>(url, { params: params });
  }

  getUserNotifications(uniqueId: string): Observable<Notification[]> {
    const params = new HttpParams()
      .set('userId', uniqueId);
    const url = `${this.REGISTRATION_URL}UserNotifications`
    return this.client.get<Notification[]>(url, { params: params });
  }
}
