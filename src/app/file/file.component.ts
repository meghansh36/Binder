import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SystemService } from '../services/system.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { RenameSheetComponent } from '../rename-sheet/rename-sheet.component';
import { BaseService } from '../services/base.service';
import { take } from 'rxjs/operators';

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
  @ViewChild('triggerFile', {read: MatMenuTrigger, static: false}) triggerFile: MatMenuTrigger;

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
  constructor(private systemService: SystemService, private cd: ChangeDetectorRef, private _bottomSheet: MatBottomSheet, private baseService: BaseService) { }


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


    this.systemService.getFilePreview(this.file['filePath']);
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

  /**
   * Opens file in compatible document editor on clicking on the file.
   */
  openFile() {
    this.systemService.openFile(this.file['filePath'])
  }

  /**
   * Opens the file menu on click.
   * @param event : Event object
   */
  openMenu(event) {
    // this.trigger.openMenu();
    event.stopPropagation();
  }

  /**
   * Closes the menu on clicking outside of the menu
   */
  dismissMenu() {
    // this.trigger.closeMenu();
  }

  /**
   * Show the file in folder view
   */
  showInFolder() {
    this.systemService.showInFolder(this.file['filePath']);
  }

  /**
   * Delete file
   */
  delete() {
    this.systemService.delete(this.file["filePath"], this);
  }

  /**
   * Rename the system file.
   */
  rename() {
    let i = this.file['filePath'].lastIndexOf('.')+1
    // get the extension of the file
    let extension = this.file['filePath'].slice(i);
    // open rename bottom sheet.
    let bottomSheetRef = this._bottomSheet.open(RenameSheetComponent, {data: extension});

    /**
     * Subscribe to the close event of the bottom sheet
     */
    bottomSheetRef.afterDismissed().subscribe(data => {
      // if the file was renamed
      if(data) {
        // rename file
        let path = this.systemService.rename(this.file['filePath'], `${data}.${extension}`);
        this.file['filePath'] = path;
        this.file['name'] = `${data}.${extension}`
      }
    })
  }

  openDialog() {
    this.baseService.openDialog('Are you sure you want to delete this file?').pipe(take(1)).subscribe((result: boolean) => {
      if(result) 
        this.delete();
    })
  }

}
