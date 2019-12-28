import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemService } from '../services/system.service';

@Component({
  selector: 'app-file-path',
  templateUrl: './file-path.component.html',
  styleUrls: ['./file-path.component.css'],
  providers: [SystemService]
})
export class FilePathComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FilePathComponent>,
    @Inject(MAT_DIALOG_DATA) public paths: string[], private systemService: SystemService) {}

  ngOnInit() {
  }

  addPath() {
    let addedPath = this.systemService.addPath();
    if(addedPath)
      this.paths.push(addedPath);
  } 

  deletePath(index) {
    if(this.systemService.deletePath(index))
      this.paths.splice(index,1);
  }

  close() {
    this.dialogRef.close(this.paths);
  }

}
