import { Component, OnInit, AfterViewInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DriveService } from '../services/drive.service';
import { BaseService } from '../services/base.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { RenameSheetComponent } from '../rename-sheet/rename-sheet.component';

interface File {
  name: string,
  thumbnailLink: string,
  hasThumbnail: boolean
  iconLink: string,
  id: string,
  mimeType: string,
  modifiedByMeTime: string,
  webViewLink: string
}

@Component({
  selector: 'app-drivefile',
  templateUrl: './drivefile.component.html',
  styleUrls: ['./drivefile.component.css'],
  providers: [DriveService]
})
export class DrivefileComponent implements OnInit, AfterViewInit {

  @ViewChild('trigger', {read: MatMenuTrigger, static: false}) trigger: MatMenuTrigger;
  // tslint:disable-next-line: no-input-rename
  @Input('fileInfo') file: File;
  imageToShow: any;
  showPreview = false;
  timer: NodeJS.Timer;
  LMDate: string;
  constructor(private driveService: DriveService, private cd: ChangeDetectorRef, private _baseService: BaseService, 
    private _bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    const date = new Date(this.file['modifiedByMeTime']);
    this.LMDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    this.getFilePreview();
  }

  ngAfterViewInit() {
    this._baseService.sliderLoadedEvent.next(true);
    this._baseService.sliderLoadedEvent.complete();
  }

  getFilePreview() {
    this.timer = setTimeout(() => {
      this.imageToShow = this.driveService.errorImg;
      this.showPreview = true;
      this.cd.detectChanges();  
    }, 80000);

    this.driveService.fetchPreview(this.file.thumbnailLink);
    this.driveService.previewEmitter.subscribe(data => {
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
    this.driveService.openDriveFile(this.file.webViewLink);
  }

  rename() {
    let bottomSheetRef: MatBottomSheetRef;
    let extension: string;

    if(this.file.mimeType === "application/vnd.google-apps.document") {
      bottomSheetRef = this._bottomSheet.open(RenameSheetComponent);
    } else {
      let i = this.file.name.lastIndexOf('.')+1
      extension = this.file.name.slice(i);
      bottomSheetRef = this._bottomSheet.open(RenameSheetComponent, {data: extension});
    }

    bottomSheetRef.afterDismissed().subscribe(data => {
      if(data) {
        this.file.mimeType === "application/vnd.google-apps.document" ? this.driveService.renameFile(this.file.id, this.file.name ,data) : this.driveService.renameFile(this.file.id, this.file.name ,`${data}.${extension}`);
        
        this.driveService.renameEmitter.subscribe((filename: string) => {
          this.file.name = filename;
        })
      }
    })
  }

  openMenu(event) {
    this.trigger.openMenu();
    event.stopPropagation();
  }

  dismissMenu() {
    this.trigger.closeMenu();
  }


}