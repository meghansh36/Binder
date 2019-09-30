import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  styleUrls: ['./filetable.component.css']
})
export class FiletableComponent implements OnInit, AfterViewInit{

  @ViewChild('paginator', {read: MatPaginator , static: true}) paginator: MatPaginator;
  @ViewChild('paginator', {read:ElementRef ,static: true}) pg: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() files: Array<File>;
  dataSource: MatTableDataSource<File>;
  displayedColumns = ['name' , 'lastMod', 'size']
  constructor() { }

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

}
