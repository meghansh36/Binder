import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs';


@Injectable()
export class SystemService {

  public systemFileEmitter = new Subject();
  public previewEmitter = new Subject();
  constructor(private _electronService: ElectronService) { }

  fetchSystemFiles() {
    if(this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('get-system-files');
      
      this._electronService.ipcRenderer.once('return-system-files', (event, fileData) => {
        this.systemFileEmitter.next(fileData);
      })
      
    }
  }

  getRandomKey() {
    return (
			"_" + Math.random().toString(36).substr(2, 9)
		);
  }

  getImageData(image: Blob) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(image);
    });
  
  }

  getFilePreview(filePath) {
    console.log('getting preview for file ', filePath);
    var uniqueChannel = `return-preview-${this.getRandomKey()}`;
    this._electronService.ipcRenderer.send('get-preview', filePath, uniqueChannel);

    this._electronService.ipcRenderer.once(`${uniqueChannel}`, async (event, rawBuffer: Buffer) => {

      try {
        let arrayBuffer = rawBuffer.buffer.slice(rawBuffer.byteOffset, rawBuffer.byteOffset + rawBuffer.byteLength);
  
        let blob = new Blob([arrayBuffer as BlobPart], {type: 'image/jpeg'});
        
        let data = await this.getImageData(blob);
        console.log(data);
        this.previewEmitter.next(data);
        // this._electronService.ipcRenderer.
        
      } catch (error) {
        console.log(error)
      }
    })
  }

  
}
