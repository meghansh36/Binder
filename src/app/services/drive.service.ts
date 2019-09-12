import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';


@Injectable({
  providedIn: 'root'
})
export class DriveService {

  // tslint:disable-next-line: variable-name
  constructor(private _electronService: ElectronService) { }

  checkGoogleLogin() {
    const loggedIn = this._electronService.ipcRenderer.sendSync('check-google-login');
    console.log(loggedIn);
  }
}
