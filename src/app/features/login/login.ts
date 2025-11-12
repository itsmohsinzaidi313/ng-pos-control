import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AsyncPipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import CryptoJS from 'crypto-js';
import { NotificationService } from '../../services/notification-service';
import { ToolbarActionService } from '../../services/toolbar-action-service';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButton, ReactiveFormsModule, MatProgressSpinnerModule, AsyncPipe, MatSnackBarModule, LoadingSpinner],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {
  loginForm: FormGroup;
  $loading: Observable<boolean> = of(false);

  constructor(private toolbarActionService: ToolbarActionService, private notificationService: NotificationService, private apiService: ApiService, private fb: FormBuilder, private router: Router,) {
    this.toolbarActionService.disableSearch();
    this.toolbarActionService.disableMenuButton();
    this.loginForm = this.fb.group({
      username: ['app@ygen', [Validators.required]],
      password: ['321', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmited(): void {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.$loading = of(true);

    const cryptUsername = CryptoJS.MD5(username).toString();
    const cryptPassword = CryptoJS.MD5(password).toString();
    this.apiService.login(cryptUsername, cryptPassword).pipe(
      catchError((err => {
        this.$loading = of(false);
        if (err instanceof HttpErrorResponse) {
          let e = err as HttpErrorResponse;
          this.notificationService.showMessage(e.message);
        }
        return of(null);
      }))
    ).subscribe(e => {
      if (e) {
        this.$loading = of(false);
        this.toolbarActionService.enableSearch();
        this.toolbarActionService.enableMenuButton();
        this.router.navigateByUrl('restaurants');
      }
    });
  }
}
