import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SystemService } from '../services/system.service';
import { DriveService } from '../services/drive.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [SystemService]
})
export class HomeComponent implements OnInit {

  systemFiles = [];
  googleDriveLogInStatus: boolean;
  constructor(private systemService: SystemService, private cd: ChangeDetectorRef, private driveService: DriveService) { }


  ngOnInit() {

    this.systemService.systemFileEmitter.subscribe((fileData: Array<object>) => {
      this.receivedSystemFiles(fileData);
    });

    this.checkGoogleLogin();
    this.fetchSystemFiles();
  }

  googleLogin() {
    this.driveService.googleLogin();
    this.driveService.googleLoginEvent.subscribe(success => {
      if (success) {
        this.googleDriveLogInStatus = true;
      }
    });
  }

  checkGoogleLogin() {
    this.googleDriveLogInStatus = this.driveService.checkGoogleLogin();
  }

  fetchSystemFiles() {
    this.systemService.fetchSystemFiles();
  }

  receivedSystemFiles(files: Array<object>) {
    this.systemFiles = files;
    console.log(this.systemFiles);
    this.cd.detectChanges();
  }

}
