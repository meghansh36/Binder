import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  @Input('fileInfo') file: Object;
  
  constructor() { }

  ngOnInit() {
  }

}
