import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SystemService } from '../services/system.service';
import { DriveService } from '../services/drive.service';
import { take } from 'rxjs/operators';
import { BaseService } from '../services/base.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { FilePathComponent } from '../file-path/file-path.component';

/**
 * This component is the main home view component
 */
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [SystemService, DriveService],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({height: '0' , opacity: 0}),
          animate('100ms', style({height: '*', opacity: 1}))
        ]),
        transition(':leave', [
          style({height: '*', opacity: 1}),
          animate('100ms', style({height: '0', opacity: 0}))
        ])
      ]
    )
  ],
})
export class HomeComponent implements OnInit {

  /**
   * array that stores the metadata of files found on the system
   */
  systemFiles = [];
  searchSystemFiles = [];
  /**
   * array that stores the metadata of files found on google drive
   */
  driveFiles: Array<object> = [];
  searchDriveFiles = [];
  /**
   * array that stores top 10 recently used files
   */
  recentDriveFiles: Array<object>;
  tableDriveFiles: Array<object>;

  /**
   * status of the google login
   */
  googleDriveLogInStatus: boolean;
  hasGoogleFileLoad:boolean;
  hasSystemFileLoad:boolean;
  searchActive = false;
  constructor(private systemService: SystemService, private cd: ChangeDetectorRef, private driveService: DriveService, private baseService: BaseService) { }


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
    this.driveService.googleLoginEvent.pipe(take(1)).subscribe(success => {
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
    // subscribe to the fetch drive files observable
    this.driveService.fetchDriveFilesEvent.pipe(take(1)).subscribe((files: Array<object>) => {
      this.driveFiles = files;
      this.hasGoogleFileLoad=true;
      this.recentDriveFiles = this.driveFiles.slice(0, 10);
      this.tableDriveFiles = this.driveFiles.slice(10);
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
    this.systemService.systemFileEmitter.pipe(take(1)).subscribe((fileData: Array<object>) => {
      this.receivedSystemFiles(fileData);
    });
  }

  /**
   * Fires after the system files are fetched
   * @param files : Array of objects for files received
   */
  receivedSystemFiles(files: Array<object>) {
    this.hasSystemFileLoad=true;
    this.systemFiles = files;
    console.log(this.systemFiles);
    // udpdate the Angular DOM explicitly    
    this.cd.detectChanges();
  }

  deleteDriveFile(file) {

    const index = this.driveFiles.indexOf(file);
    console.log(index, file)
    this.driveService.delete(file.id);
    this.driveService.deleteEmitter.pipe(take(1)).subscribe((successfullyDeleted: boolean) => {
      if(successfullyDeleted) {
        if(index < 10) {
          this.recentDriveFiles.splice(index,1);
          this.recentDriveFiles.push(this.tableDriveFiles.splice(0,1)[0]);
          this.recentDriveFiles = [...this.recentDriveFiles];
        } else {
          this.tableDriveFiles.splice(index-10,1);
        }
        this.tableDriveFiles = [...this.tableDriveFiles];
        this.driveFiles.splice(index,1);
      }
    })
  }


  searchClose() {
    this.searchActive = false;
  }

  searchOpen() {

  }

  searchEntered(searchText) {
    if(searchText.length > 0) {
      this.searchActive = true;
      this.searchDriveFiles = this.baseService.searchFiles([...this.driveFiles], searchText);
      this.searchSystemFiles = this.baseService.searchFiles([...this.systemFiles], searchText);
      console.log(this.searchSystemFiles);
      console.log(this.searchDriveFiles)
    }
  }

  openFile(filePath) {
    this.systemService.openFile(filePath)
  }

  openDriveFile(link) {
    this.driveService.openDriveFile(link);
  }

  refreshSystemFiles() {
    this.fetchSystemFiles();
  }

  addPaths() {
    let paths = this.systemService.getPaths();

    this.baseService.zone.run(() => {
      const dialogRef = this.baseService.dialog.open(FilePathComponent, {
        width: '500px',
        height: '300px',
        data: [...paths]
      });

      dialogRef.afterClosed().pipe(take(1)).subscribe(modifiedPaths => {
        if (JSON.stringify(paths) !== JSON.stringify(modifiedPaths)) {
          //refresh the results
          this.refreshSystemFiles();
        }
      })
    });
  }


}
