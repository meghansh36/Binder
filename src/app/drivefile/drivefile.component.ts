import { Component, OnInit, AfterViewInit, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { DriveService } from '../services/drive.service';
import { BaseService } from '../services/base.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { take } from 'rxjs/operators';

interface File {
  name: string,
  thumbnailLink: string,
  hasThumbnail: boolean
  iconLink: string,
  id: string,
  mimeType: string,
  modifiedByMeTime: string,
  webViewLink: string
  size?: string,
  owners: Array<object>,
  ownedByMe: boolean
}

/**
 This component is used to render file preview in recent google docs
 */
@Component({
  selector: 'app-drivefile',
  templateUrl: './drivefile.component.html',
  styleUrls: ['./drivefile.component.css'],
  providers: [DriveService]
})
export class DrivefileComponent implements OnInit, AfterViewInit {

  @Output('deleteFile') deleteOutputEvent = new EventEmitter();


  // trigger for menu button
  @ViewChild('trigger', {read: MatMenuTrigger, static: false}) trigger: MatMenuTrigger;
  /**
   * the file metadata object
   */
  @Input('fileInfo') file: File;
  /**
   * Preview image base64 string
   */
  imageToShow: any;
  /**
   * whether to show proview or show loader. Initally set to show loader.
   */
  showPreview = false;
  timer: NodeJS.Timer;
  owner: string;
  /**
   * Last modified date string of the file
   */
  LMDate: string;
  constructor(private driveService: DriveService, private cd: ChangeDetectorRef, private _baseService: BaseService) { }

  ngOnInit() {
    // generate date from the modified time in time string format used by google
    const date = new Date(this.file['modifiedByMeTime']);
    this.LMDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    if(this.file.ownedByMe) {
        this.owner = 'You'
    } else {
      this.owner = this.file.owners[0]['displayName'];
    }
    this.getFilePreview();
  }

  /**
   * Send event that slider has been loaded.
   */
  ngAfterViewInit() {
    // send event
    this._baseService.sliderLoadedEvent.next(true);
    // complete the event. Hence, the slider loaded event is only captured once.
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
    this.driveService.renameFile(this.file);
    this.driveService.renameEmitter.subscribe((filename: string) => {
      this.file.name = filename;
    });
  }

  openMenu(event) {
    event.stopPropagation();
  }

  dismissMenu() {
    this.trigger.closeMenu();
  }

  delete() {
    this.deleteOutputEvent.emit(this.file);
  }

  openDialog() {
    this._baseService.openDialog('Are you sure you want to delete this file?').pipe(take(1)).subscribe((result: boolean) => {
      if(result) 
        this.delete();
    })
  }


}