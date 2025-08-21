import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';
import { LoginResponse } from '../models/login-response';
import { Restaurant } from '../models/restaurant';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly DEVICEID = '321661E0-9874-11EE-BBE0-9F04E8D08641';
  private readonly BASEURL = 'http://localhost:5004/api/v2/';

  constructor(private client: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    var cryptUsername = CryptoJS.MD5(username).toString();
    var cryptPassword = CryptoJS.MD5(password).toString();
    var requestBody = {
      Username: cryptUsername,
      Passphrase: cryptPassword,
      DeviceId: this.DEVICEID,
    };
    var url = this.getUrl('Security/AppAuth');

    return this.client.post<LoginResponse>(url, requestBody, { headers: { 'content-type': 'application/json' }, observe: 'response' })
      .pipe(
        map((response, _) => {
          if (response.ok) {
            var body = response.body!;

            localStorage.setItem('token', body.token);
            localStorage.setItem('username', cryptUsername);
            localStorage.setItem('password', cryptPassword);
            return true;
          }
          return false
        })
      );
  }

  updateToken(): Observable<boolean> {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (username && password) {

      return this.login(username, password);
    }
    throw new Error("Invalid username or password");
  }

  getRestaurants(): Observable<Restaurant[]> {
    const token = localStorage.getItem('token');
    var headers = {
      ContentType: 'application/json',
      Authorization: `Bearer ${token}`,
    }
    return this.client.get<Restaurant[]>(this.getUrl('Registration/RegistrationRecords'), { headers: headers }).pipe(
      switchMap(e => {
        return of(e);
      })
    );
  }

  private getUrl(path: string): string {
    return `${this.BASEURL}${path}`;
  }
}
