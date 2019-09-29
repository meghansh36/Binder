import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SystemService } from '../services/system.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { RenameSheetComponent } from '../rename-sheet/rename-sheet.component';

/**
 * Component for displaying each system file
 */
@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
  providers: [SystemService]
})
export class FileComponent implements OnInit {
  /**
   * trigger for menu button
   */
  @ViewChild('trigger', {read: MatMenuTrigger, static: false}) trigger: MatMenuTrigger;

  /**
   * The file metadata object for this file.
   */
  @Input('fileInfo') file: object;

  /**
   * Preview image base64 string
   */
  imageToShow: any;
  /**
   * whether to show proview or show loader. Initally set to show loader.
   */
  showPreview = false;
  timer: NodeJS.Timer;

  /**
   * Last modified date string of the file
   */
  LMDate: string;
  constructor(private systemService: SystemService, private cd: ChangeDetectorRef, private _bottomSheet: MatBottomSheet) { }


  ngOnInit() {
    // generate date from the modified time in milliseconds.
    let date = new Date(this.file["stat"].mtimeMs);
    this.LMDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    // call generate preview function
    this.generateFilePreview();
  }
  
  /**
   * This function fetches the files preview
   */
  generateFilePreview() {
    // ste timer to wait for 80 seconds to fetch preview. If preview not fetched within 80s, error image is shown.
    this.timer = setTimeout(() => {
      // show error image
      this.imageToShow = this.systemService.errorImg;
      this.showPreview = true;
      this.cd.detectChanges();  
    }, 80000);


    this.systemService.getFilePreview(this.file['filename']);
    /**
     * Subscribe to the preview emitter observable
     */
    this.systemService.previewEmitter.subscribe(data => {
      this.renderPreview(data);
    })
  }

  /**
   * Render the preview image of the file
   * @param data : base64 string of the image
   */
  renderPreview(data) {
    // clear the timer on successful fetch of preview image
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
