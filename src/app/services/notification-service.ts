import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackbar = inject(MatSnackBar);

  showMessage(message: string, duration?: number): MatSnackBarRef<TextOnlySnackBar> {
    const config = new MatSnackBarConfig();
    config.duration = duration;
    return this.snackbar.open(message, duration === undefined ? 'Dismiss' : undefined, config);
  }
}
