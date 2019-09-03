import { Component, OnInit, Input } from '@angular/core';
import { SystemService } from '../services/system.service';

@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  @Input('fileInfo') file: Object;

  constructor(private systemService: SystemService) { }

  ngOnInit() {
    //show loader
    //call generate preview function
    this.generateFilePreview();
  }

  generateFilePreview() {
    this.systemService.getFilePreview(this.file['filename']);
  }

}
