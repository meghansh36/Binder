import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SystemService } from '../services/system.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { RenameSheetComponent } from '../rename-sheet/rename-sheet.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
  providers: [SystemService]
})
export class FileComponent implements OnInit {
  @ViewChild('trigger', {read: MatMenuTrigger, static: false}) trigger: MatMenuTrigger;
  // tslint:disable-next-line: no-input-rename
  @Input('fileInfo') file: object;
  imageToShow: any;
  showPreview = false;
  timer: NodeJS.Timer;
  LMDate: string;
  visible = true;
  constructor(private systemService: SystemService, private cd: ChangeDetectorRef, private _bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    // show loader
    // call generate preview function
    let date = new Date(this.file["stat"].mtimeMs);
    this.LMDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    this.generateFilePreview();
  }
  
  generateFilePreview() {
    this.timer = setTimeout(() => {
      this.imageToShow = this.systemService.errorImg;
      this.showPreview = true;
      this.cd.detectChanges();  
    }, 80000);

    this.systemService.getFilePreview(this.file['filename']);
    this.systemService.previewEmitter.subscribe(data => {
      this.renderPreview(data);
    })
  }

  renderPreview(data) {
    clearTimeout(this.timer);
    this.imageToShow = data;
    this.showPreview = true;
    this.cd.detectChanges();
  }

  openFile() {
    this.systemService.openFile(this.file['filename'])
  }

  openMenu(event) {
    this.trigger.openMenu();
    event.stopPropagation();
  }

  dismissMenu() {
    this.trigger.closeMenu();
  }

  showInFolder() {
    this.systemService.showInFolder(this.file['filename']);
  }

  delete() {
    this.systemService.delete(this.file["filename"], this);
  }

  rename() {
    let i = this.file['filename'].lastIndexOf('.')+1
    let extension = this.file['filename'].slice(i);
    let bottomSheetRef = this._bottomSheet.open(RenameSheetComponent, {data: extension});

    bottomSheetRef.afterDismissed().subscribe(data => {
      if(data) {
        let path = this.systemService.rename(this.file['filename'], `${data}.${extension}`);
        this.file['filename'] = path;
      }
    })
  }

}
