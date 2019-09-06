import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SystemService } from '../services/system.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [SystemService]
})
export class HomeComponent implements OnInit {

  systemFiles = [];
  constructor(private systemService: SystemService, private cd: ChangeDetectorRef) { }


  ngOnInit() {

    this.systemService.systemFileEmitter.subscribe((fileData:Array<Object>) => {
      this.receivedSystemFiles(fileData);
    })

    this.fetchSystemFiles();
  }

  fetchSystemFiles() {
    this.systemService.fetchSystemFiles();
  }

  receivedSystemFiles(files:Array<Object>) {
    
    // this.systemFiles.push(files[0]);
    // this.systemFiles.push(files[1]);
    this.systemFiles = files;
    console.log(this.systemFiles);
    this.cd.detectChanges();
  }

}
