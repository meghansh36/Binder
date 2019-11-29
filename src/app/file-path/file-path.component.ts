import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-path',
  templateUrl: './file-path.component.html',
  styleUrls: ['./file-path.component.css']
})
export class FilePathComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FilePathComponent>,
    @Inject(MAT_DIALOG_DATA) public paths: string) { }

  ngOnInit() {
  }

}
