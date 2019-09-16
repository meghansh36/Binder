import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SystemService } from '../services/system.service';
import { DriveService } from '../services/drive.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [SystemService, DriveService]
})
export class HomeComponent implements OnInit {

  systemFiles = [];
  driveFiles: Array<object>;
  recentDriveFiles: Array<object>;
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
        this.fetchDriveFiles();
      }
    });
  }

  checkGoogleLogin() {
    this.googleDriveLogInStatus = this.driveService.checkGoogleLogin();
    this.fetchDriveFiles();
    this.driveService.fetchDriveFilesEvent.subscribe((files: Array<object>) => {
      this.driveFiles = files;
      this.recentDriveFiles = this.driveFiles.slice(0, 10);
      this.cd.detectChanges();
    });
  }

  fetchDriveFiles() {
    this.driveService.fetchDriveFiles();
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
