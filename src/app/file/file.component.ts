import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { SystemService } from '../services/system.service';

@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
  providers: [SystemService]
})
export class FileComponent implements OnInit {

  @Input('fileInfo') file: Object;
  imageToShow: any;
  showPreview = false;
  timer: NodeJS.Timer;
  LMDate: string;
  constructor(private systemService: SystemService, private cd: ChangeDetectorRef) { }
  
  ngOnInit() {
    //show loader
    //call generate preview function
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

}
