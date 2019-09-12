import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DriveService {

  googleLoginEvent = new Subject();
  // tslint:disable-next-line: variable-name
  constructor(private _electronService: ElectronService, private snackBar: MatSnackBar) { }

  checkGoogleLogin() {
    const loggedIn = this._electronService.ipcRenderer.sendSync('check-google-login');
    if (loggedIn) {
      return true;
    } else {
      return false;
    }
  }

  googleLogin() {
    this._electronService.ipcRenderer.send('google-drive-login');

    this._electronService.ipcRenderer.on('google-login-response', (event, success) => {
      if (success) {
        this.googleLoginEvent.next(true);
      } else {
        this.snackBar.open('Error in Google Login', '', {panelClass: 'failure', duration: 2000});
      }
    });

  }
}
