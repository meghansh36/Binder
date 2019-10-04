import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(private zone: NgZone, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  sliderLoadedEvent = new Subject();
  dialogClosedEmitter = new Subject();

  showSnackBar(message:string, classType:string) {
    this.zone.run(() => {
      this.snackBar.open(message, '', {panelClass: classType, duration: 2000,
            horizontalPosition: 'center', verticalPosition: 'bottom'});
    });
  }

  openDialog(message: string) {
    this.zone.run(() => {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        height: '150px',
        data: message
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.dialogClosedEmitter.next(result);
      });
    });


    return this.dialogClosedEmitter;
  }
}
