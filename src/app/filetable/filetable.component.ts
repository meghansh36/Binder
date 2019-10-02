import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { DriveService } from '../services/drive.service';

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
    sizeString?: string
  }

@Component({
  selector: 'filetable',
  templateUrl: './filetable.component.html',
  styleUrls: ['./filetable.component.css'],
  providers: [DriveService]
})
export class FiletableComponent implements OnInit, AfterViewInit{

  /**
   * trigger for menu button
   */
  @ViewChild('trigger', {read: MatMenuTrigger, static: false}) trigger: MatMenuTrigger;

  
  @ViewChild('paginator', {read: MatPaginator , static: true}) paginator: MatPaginator;
  @ViewChild('paginator', {read:ElementRef ,static: true}) pg: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() files: Array<File>;
  dataSource: MatTableDataSource<File>;
  displayedColumns = ['name' , 'lastMod', 'size', 'options']

  selectedFile: File;
  constructor(private driveService: DriveService) { }

  ngOnInit() {
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

      return file;
    });

    this.dataSource = new MatTableDataSource<File>(this.files);
    setTimeout(() => {
      
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.pg.nativeElement.click();
  }

  /**
   * Opens the file menu on click.
   * @param event : Event object
   */
  openMenu(event, file) {
    this.selectedFile = file;
    this.trigger.openMenu();
    event.stopPropagation();
  }

  /**
   * Closes the menu on clicking outside of the menu
   */
  dismissMenu() {
    console.log('dismissed')
    this.trigger.closeMenu();
  }

  removeSelectedFile() {
    this.selectedFile = undefined;
  }

  refreshTable() {
    this.dataSource.paginator = this.paginator;
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


}