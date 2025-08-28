import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';
import { LoginResponse } from '../models/login-response';
import { Restaurant } from '../models/restaurant';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Branch } from '../models/branch';
import { System } from 'typescript';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly DEVICEID = '321661E0-9874-11EE-BBE0-9F04E8D08641';
  private readonly BASEURL = 'http://localhost:5004/api/v2/';

  constructor(private client: HttpClient) { }

  private getUrl(path: string): string {
    return `${this.BASEURL}${path}`;
  }

  login(username?: string, password?: string): Observable<boolean> {
    let cryptUsername: string = '';
    let cryptPassword: string = '';
    if (username === '' && password === '') {
      cryptUsername = CryptoJS.MD5(username).toString();
      cryptPassword = CryptoJS.MD5(password).toString();
    } else {
      cryptUsername = localStorage.getItem('username')!;
      cryptPassword = localStorage.getItem('password')!;
    }
    var requestBody = {
      Username: cryptUsername,
      Passphrase: cryptPassword,
      DeviceId: this.DEVICEID,
    };
    var url = this.getUrl('Security/AppAuth');

    return this.client.post<LoginResponse>(url, requestBody, { observe: 'response' })
      .pipe(
        switchMap((response, index) => {
          if (response.ok) {
            var body = response.body!;
            localStorage.setItem('token', body.token);
            localStorage.setItem('username', cryptUsername);
            localStorage.setItem('password', cryptPassword);
          }
          return of(response);
        }),
        map((value) => value.ok)
      );
  }

  updateToken(): Observable<boolean> {
    return this.login();
  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.client.get<Restaurant[]>(this.getUrl('Registration/Restaurants'));
  }

  getBranches(uniqueId: string): Observable<Branch[]> {
    const params = new HttpParams()
      .set('restaurantId', uniqueId);
    return this.client.get<Branch[]>(this.getUrl('Registration/Branch'), { params: params });
  }

  getSystems(uniqueId: string): Observable<System[]> {
    const params = new HttpParams()
      .set('branchId', uniqueId);
    return this.client.get<System[]>(this.getUrl('Systems'), {
      params
    });
  }

  onError(err: any): Observable<any> {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      this.updateToken().pipe(switchMap((value, index) => of(value)));
    }
    return throwError(() => err);
  }
}
