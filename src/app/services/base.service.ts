import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private allFiles = [];
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

  createLPS(pattern) {
    let lps = new Array(pattern.length)

    lps[0] = 0;
    let j = 0;
    let i = 1;

    while( i < pattern.length) {
      if(pattern[j] === pattern[i]) {
        lps[i] = j+1;
        i++; j++;
      } else {
        if(j == 0) {
          lps[i] = 0; i++;
        } else {
          j = lps[j-1]
        }
      }
    }

    return lps;
  }

  KMPSearching(lps, name, pattern) {
    let j = 0; 
    let i = 0;

    while( i < name.length && j != pattern.length-1) {
      if(pattern[j+1] === name[i]) {
        j++; i++;
      } else {
        if(j === 0) i++;
        else {
          j = lps[j];
        }
      }
    }

    if (j !== pattern.length-1) {
      return null;
    } else {
      console.log("success")
      return i-1;
    }
  }

  searchFiles(files:Array<any>, pattern:string) {
    pattern = pattern.toLowerCase();
    let lps = this.createLPS(pattern);
    lps.splice(0, 0, null);
    console.log(lps)

    let filenames = files.map(val => val.name.toLowerCase());
    console.log(filenames);
    let searchResults = []
    filenames.forEach((name, index) => {
      let searchResult = this.KMPSearching(lps, name, pattern);
      if(searchResult !== null) 
        searchResults.push({name, start: searchResult-pattern.length+1 });
    })

    console.log(searchResults)
  }


}
