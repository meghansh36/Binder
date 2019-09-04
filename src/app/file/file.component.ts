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
  constructor(private systemService: SystemService, private cd: ChangeDetectorRef) { 
  }
  
  ngOnInit() {
    //show loader
    //call generate preview function
    this.generateFilePreview();
  }
  
  generateFilePreview() {
    this.systemService.getFilePreview(this.file['filename']);
    this.systemService.previewEmitter.subscribe(data => {
      this.renderPreview(data);
    })
  }

  renderPreview(data) {
    this.imageToShow = data;
    this.showPreview = true;
    this.cd.detectChanges();
  }

}
