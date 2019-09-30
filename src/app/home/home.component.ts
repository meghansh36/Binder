import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SystemService } from '../services/system.service';
import { DriveService } from '../services/drive.service';

/**
 * This component is the main home view component
 */
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [SystemService, DriveService]
})
export class HomeComponent implements OnInit {

  /**
   * array that stores the metadata of files found on the system
   */
  systemFiles = [];

  /**
   * array that stores the metadata of files found on google drive
   */
  driveFiles: Array<object> = [];

  /**
   * array that stores top 10 recently used files
   */
  recentDriveFiles: Array<object>;

  /**
   * status of the google login
   */
  googleDriveLogInStatus: boolean;

  constructor(private systemService: SystemService, private cd: ChangeDetectorRef, private driveService: DriveService) { }


  ngOnInit() {
    // check google login status
    this.checkGoogleLogin();
    // fetch system files
    this.fetchSystemFiles();
  }

  /**
   * Initiate google login procedure
   */
  googleLogin() {
    this.driveService.googleLogin();
    this.driveService.googleLoginEvent.subscribe(success => {
      if (success) {
        this.googleDriveLogInStatus = true;
        // fetch drive files on successful login
        this.fetchDriveFiles();
      }
    });
  }

  /**
   * Check the status of google login
   */
  checkGoogleLogin() {
    this.googleDriveLogInStatus = this.driveService.checkGoogleLogin();
    if(this.googleDriveLogInStatus)
      this.fetchDriveFiles();
  }
  
  /**
   * fetches drive files from the proxy server
   */
  fetchDriveFiles() {
    this.driveService.fetchDriveFiles();
    // subscribe to the ftehc drive files observable
    this.driveService.fetchDriveFilesEvent.subscribe((files: Array<object>) => {
      this.driveFiles = files;
      this.recentDriveFiles = this.driveFiles.slice(0, 10);
      // udpdate the Angular DOM explicitly
      this.cd.detectChanges();
    });
  }

  /**
   * Fetch files from the system
   */
  fetchSystemFiles() {
    this.systemService.fetchSystemFiles();

    /**
     * Subscribes to the fetch system files observable
     */
    this.systemService.systemFileEmitter.subscribe((fileData: Array<object>) => {
      this.receivedSystemFiles(fileData);
    });
  }

  /**
   * Fires after the system files are fetched
   * @param files : Array of objects for files received
   */
  receivedSystemFiles(files: Array<object>) {
    this.systemFiles = files;
    console.log(this.systemFiles);
    // udpdate the Angular DOM explicitly    
    this.cd.detectChanges();
  }

}
