import { Component, OnInit, Input } from '@angular/core';

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
export class FiletableComponent implements OnInit{

  @Input() files: Array<File>;

  displayedColumns = ['name' , 'lastMod', 'size']
  constructor() { }

  ngOnInit() {
    this.files = this.files.map((file:File) => {
      let date = new Date(file['modifiedByMeTime']);
      let dateString = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`

      file.modifiedTime = dateString;

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
  }

}
