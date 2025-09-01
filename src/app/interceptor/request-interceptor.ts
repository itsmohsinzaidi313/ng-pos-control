import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiService } from '../services/api-service';
import { catchError, delay, of, switchMap, tap, throwError } from 'rxjs';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(ApiService);
  if (req.url.includes('AppAuth')) {
    const headers = getHeaders();
    const clone = req.clone({ headers: headers });
    return next(clone);
  }
  const headers = getAuthHeaders();
  const clone = req.clone({ headers: headers })
  return next(clone).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        service.updateToken()
          .subscribe((value) => {
            const headers = getAuthHeaders();
            return next(req.clone({ headers: headers }))
          });
      }
      return throwError(() => err);
    })
  );
};

const getHeaders = (): HttpHeaders => {
  return new HttpHeaders()
    .set('ContentType', 'application/json');
}

const getAuthHeaders = (): HttpHeaders => {
  return new HttpHeaders()
    .set('ContentType', 'application/json')
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`);
}