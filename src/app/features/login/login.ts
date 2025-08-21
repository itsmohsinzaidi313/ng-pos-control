import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginFailureDialog } from '../../components/login-failure-dialog/login-failure-dialog';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButton, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {
  loginForm: FormGroup;
  private dialog = inject(MatDialog);
  constructor(private service: ApiService, private fb: FormBuilder, private router: Router,) {
    this.loginForm = this.fb.group({
      username: ['app@ygen', [Validators.required]],
      password: ['321', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmited(): void {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.service.login(username, password).pipe(
      catchError((err => {
        this.dialog.open(LoginFailureDialog);
        return of(null);
      }))
    ).subscribe(e => {
      if (e)
        this.router.navigateByUrl('home');
    });
  }
}
