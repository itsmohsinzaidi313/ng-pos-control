import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-login-failure-dialog',
  imports: [MatButtonModule, MatDialogModule, MatCardModule, MatIconModule],
  templateUrl: './login-failure-dialog.html',
  styleUrl: './login-failure-dialog.scss'
})
export class LoginFailureDialog {
  readonly dialogRef = inject(MatDialogRef<LoginFailureDialog>);

  onClose(): void {
    this.dialogRef.close();
  }
}
