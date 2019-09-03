import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';


@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private _electronService: ElectronService) { }

  fetchSystemFiles() {
    if(this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('get-system-files');


      this._electronService.ipcRenderer.on('return-system-files', (event, fileData) => {
        console.log(event, fileData);
      })
    }


  }
}
