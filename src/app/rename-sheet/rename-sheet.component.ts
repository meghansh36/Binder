import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-rename-sheet',
  templateUrl: './rename-sheet.component.html',
  styleUrls: ['./rename-sheet.component.css']
})
export class RenameSheetComponent implements OnInit {

  rename = new FormControl('', [Validators.required]);
  constructor(private _bottomSheetRef: MatBottomSheetRef<RenameSheetComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit(){}

  getErrorMessage() {
    return this.rename.hasError('required') ? 'You must enter a value' : '';
  }

  close() {
    if(this.rename.value)
      this._bottomSheetRef.dismiss(this.rename.value);
  }

}
