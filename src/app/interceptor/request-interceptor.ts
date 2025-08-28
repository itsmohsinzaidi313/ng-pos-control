import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiService } from '../services/api-service';
import { catchError, delay, of, switchMap, tap, throwError } from 'rxjs';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(ApiService);
  const headers = new HttpHeaders()
    .append('ContentType', 'application/json');
  if (req.url.includes('AppAuth')) {
    const clone = req.clone({headers: headers});
    return next(clone);
  }

  headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  const clone = req.clone({ headers: headers })
  return next(clone);
};
