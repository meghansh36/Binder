import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SystemService {

  public systemFileEmitter = new Subject();

  constructor(private _electronService: ElectronService) { }

  fetchSystemFiles() {
    if(this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('get-system-files');
      
      this._electronService.ipcRenderer.once('return-system-files', (event, fileData) => {
        this.systemFileEmitter.next(fileData);
      })
      
    }
  }

  getFilePreview(filePath) {
    this._electronService.ipcRenderer.send('get-preview', filePath);

    this._electronService.ipcRenderer.once('return-preview', (event, rawBuffer: Buffer) => {
      let arrayBuffer = rawBuffer.buffer.slice(rawBuffer.byteOffset, rawBuffer.byteOffset + rawBuffer.byteLength);

      let blob = new Blob([arrayBuffer as BlobPart], {type: 'image/jpeg'});
      console.log(blob);
    })
  }

  
}
