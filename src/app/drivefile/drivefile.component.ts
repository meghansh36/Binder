import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drivefile',
  templateUrl: './drivefile.component.html',
  styleUrls: ['./drivefile.component.css']
})
export class DrivefileComponent implements OnInit {

  // @ViewChild('trigger', {read: MatMenuTrigger, static: false}) trigger: MatMenuTrigger;
  // // tslint:disable-next-line: no-input-rename
  // @Input('fileInfo') file: object;
  imageToShow: any;
  showPreview = false;
  timer: NodeJS.Timer;
  LMDate: string;
  visible = true;
  constructor() { }

  ngOnInit() {
  }

}
