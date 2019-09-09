import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { HomeComponent } from './home/home.component';


import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { ClickOutsideModule } from 'ng-click-outside';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';
import { FileNamePipe } from './pipes/file-name.pipe';
import { RenameSheetComponent } from './rename-sheet/rename-sheet.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'
@NgModule({
  declarations: [
    AppComponent,
    FileComponent,
    HomeComponent,
    FileNamePipe,
    RenameSheetComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    NgxElectronModule,
    MatMenuModule,
    ClickOutsideModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [RenameSheetComponent]
})
export class AppModule { }
