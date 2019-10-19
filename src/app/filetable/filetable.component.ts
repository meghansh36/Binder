import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { DriveService } from '../services/drive.service';
import { BaseService } from '../services/base.service';
import { take } from 'rxjs/operators';

  interface File {
    name: string,
    thumbnailLink: string,
    hasThumbnail: boolean
    iconLink: string,
    id: string,
    mimeType: string,
    modifiedByMeTime: string,
    webViewLink: string,
    modifiedTime?: string,
    size?: number,
    sizeString?: string,
    owners: Array<object>,
    ownedByMe: boolean,
    ownerName: string,
    exportLinks: object
  }

@Component({
  selector: 'filetable',
  templateUrl: './filetable.component.html',
  styleUrls: ['./filetable.component.css'],
  providers: [DriveService],
})
export class FiletableComponent implements OnInit, AfterViewInit{

  /**
   * trigger for menu button
   */
  @ViewChild('trigger', {read: MatMenuTrigger, static: false}) trigger: MatMenuTrigger;

  
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // @ViewChild('paginator', {read:ElementRef ,static: true}) pg: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Input('files') files: Array<File>;

  @Output('deleteFile') deleteOutputEvent = new EventEmitter();
  dataSource = new MatTableDataSource<File>([]);
  displayedColumns = ['name' , 'lastMod', 'size', 'ownedBy','options']

  selectedFile: File;
  constructor(private driveService: DriveService, private baseService: BaseService) { }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // this.pg.nativeElement.click();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.files = this.files.map((file:File) => {
  
      let date = new Date(file['modifiedByMeTime']);
      if(date.getDate()) {
        
        file.modifiedTime = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
      } else {
        file.modifiedTime = '-';
      }
  
      if(file.size) {
        let size = file.size/1000;
        if(size/1000 < 1) {
          file.sizeString = `${size.toFixed(2)} KB`;
        } else {
          file.sizeString = `${(size/1000).toFixed(2)} MB`
        }
      } else {
        file.sizeString = '-';
      }

      if(file.ownedByMe) {
          file.ownerName = 'You'
      } else {
          file.ownerName = file.owners[0]['displayName'];
      }
  
      return file;
    });

  
    this.dataSource.data = this.files;
    // this.refreshTable();
    console.log('inside on change', changes)
  }

  /**
   * Opens the file menu on click.
   * @param event : Event object
   */
  openMenu(event, file) {
    console.log('opening menu')
    this.selectedFile = file;
    event.stopPropagation();
  }

  removeSelectedFile() {
    this.selectedFile = undefined;
  }

  refreshTable() {
    // this.dataSource.paginator = this.paginator;
    console.log(this.dataSource.paginator)
    // this.pg.nativeElement.click();
  }

  openFile() {
    this.driveService.openDriveFile(this.selectedFile.webViewLink);
    this.removeSelectedFile();
  }

  rename() {
    let index = this.dataSource.data.indexOf(this.selectedFile);
    this.driveService.renameFile(this.selectedFile);
    this.driveService.renameEmitter.subscribe((filename: string) => {
      this.selectedFile.name = filename;
      this.dataSource.data[index] = this.selectedFile;
      this.refreshTable();
      this.removeSelectedFile();
    });
  }

  delete() {
    this.deleteOutputEvent.emit(this.selectedFile);
    this.removeSelectedFile();
  }

  openDialog() {
    this.baseService.openDialog('Are you sure you want to delete this file?').pipe(take(1)).subscribe((result: boolean) => {
      if(result) 
        this.delete();
    })
  }

  downloadFile(event, downloadAs) {
    let exportLink: string;
    let pdfMimeType = 'application/pdf';
    let wordMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if(this.selectedFile.mimeType === 'application/vnd.google-apps.document') {
      exportLink = (downloadAs === 'word') ? this.selectedFile.exportLinks[wordMimeType] : this.selectedFile.exportLinks[pdfMimeType];
    } else {
      exportLink = `https://www.googleapis.com/drive/v3/files/${this.selectedFile.id}?alt=media`;
    }
    console.log(exportLink);
    this.driveService.downloadFile(exportLink, this.selectedFile.name, this.selectedFile.mimeType, downloadAs);
    this.removeSelectedFile();
  }


}
