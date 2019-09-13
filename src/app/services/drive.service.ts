import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DriveService {

  googleLoginEvent = new Subject();
  // tslint:disable-next-line: variable-name
  constructor(private _electronService: ElectronService, private snackBar: MatSnackBar, private zone: NgZone) { }

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

    this._electronService.ipcRenderer.once('google-login-response', (event, success) => {
      if (success) {
        this.googleLoginEvent.next(true);
      } else {
        this.zone.run(() => {
          this.snackBar.open('Error in Google Login', '', {panelClass: 'failure', duration: 2000,
            horizontalPosition: 'center', verticalPosition: 'bottom'});
        });
      }
    });

  }

  fetchDriveFiles() {
    this._electronService.ipcRenderer.send('fetch-drive-files');
  }
}
