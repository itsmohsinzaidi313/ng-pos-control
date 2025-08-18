import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButton],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class Login {
  onSubmited(): void {
    console.log('clicked');
  }

}
