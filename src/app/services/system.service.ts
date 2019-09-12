import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class SystemService {
  // tslint:disable-next-line: variable-name
  constructor(private _electronService: ElectronService, private snackBar: MatSnackBar, private zone: NgZone) { }

  public systemFileEmitter = new Subject();
  public previewEmitter = new Subject();


  // tslint:disable-next-line: max-line-length
  public errorImg = 'data:image/png;base64,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';

  fetchSystemFiles() {
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('get-system-files');
      this._electronService.ipcRenderer.once('return-system-files', (event, fileData) => {
        this.systemFileEmitter.next(fileData);
      });
    }
  }

  getRandomKey() {
    return ( '_' + Math.random().toString(36).substr(2, 15));
  }

  getImageData(image: Blob) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(image);
    });

  }

  getFilePreview(filePath) {
    const uniqueChannel = `return-preview-${this.getRandomKey()}`;
    this._electronService.ipcRenderer.send('get-preview', filePath, uniqueChannel);

    this._electronService.ipcRenderer.once(uniqueChannel, async (event, rawBuffer: Buffer) => {

      try {
        const arrayBuffer = rawBuffer.buffer.slice(rawBuffer.byteOffset, rawBuffer.byteOffset + rawBuffer.byteLength);

        const blob = new Blob([arrayBuffer as BlobPart], {type: 'image/jpeg'});

        const data = await this.getImageData(blob);
        this.previewEmitter.next(data);
        // this._electronService.ipcRenderer.

      } catch (error) {
        console.log(error);
      }
    });
  }

  openFile(filePath) {
    this._electronService.ipcRenderer.send('openSysFile', filePath);
  }

  showInFolder(filePath) {
    this._electronService.ipcRenderer.send('showSysFile', filePath);
  }

  delete(filePath, file) {
    const uniqueChannel = `delete-${this.getRandomKey()}`;
    this._electronService.ipcRenderer.send('deleteSysFile', filePath, uniqueChannel);

    this._electronService.ipcRenderer.once(`${uniqueChannel}-success`, (event) => {
      this.zone.run(() => {
        this.snackBar.open('File Deleted Successfully', '', {panelClass: 'success', duration: 2000, horizontalPosition: 'center',
      verticalPosition: 'bottom'});
        file.visible = false;
      });
    });

    this._electronService.ipcRenderer.once(`${uniqueChannel}-failure`, (event) => {
      this.zone.run(() => {
        this.snackBar.open('Error in Deleting File', '', {panelClass: 'failure', duration: 2000, horizontalPosition: 'center',
      verticalPosition: 'bottom'});
      });
    });
  }

  rename(filePath, newName) {
    const response = this._electronService.ipcRenderer.sendSync('renameSysFile', filePath, newName);
    if (response.success) {
      this.zone.run(() => {
        this.snackBar.open('File Renamed Successfully', '', {panelClass: 'success', duration: 2000, horizontalPosition: 'center',
      verticalPosition: 'bottom'});
      });
      return response.path;

    } else {
      this.zone.run(() => {
        this.snackBar.open('Error in Renaming File', '', {panelClass: 'failure', duration: 2000, horizontalPosition: 'center',
      verticalPosition: 'bottom'});
      });
      return response.path;
    }
  }

}
