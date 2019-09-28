import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(private zone: NgZone, private snackBar: MatSnackBar) { }

  sliderLoadedEvent = new Subject();

  showSnackBar(message:string, classType:string) {
    this.zone.run(() => {
      this.snackBar.open(message, '', {panelClass: classType, duration: 2000,
            horizontalPosition: 'center', verticalPosition: 'bottom'});
    });
  }
}
