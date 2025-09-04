import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackbar = inject(MatSnackBar);

  showMessage(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message, 'Dismiss');
  }
}
