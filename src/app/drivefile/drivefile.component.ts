import { Component, OnInit, AfterViewInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DriveService } from '../services/drive.service';
import { BaseService } from '../services/base.service';
import { MatMenuTrigger } from '@angular/material/menu';

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
  constructor(private driveService: DriveService, private cd: ChangeDetectorRef, private _baseService: BaseService) { }

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

  openMenu(event) {
    this.trigger.openMenu();
    event.stopPropagation();
  }

  dismissMenu() {
    this.trigger.closeMenu();
  }


}