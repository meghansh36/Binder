import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { HomeComponent } from './home/home.component';


import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { ClickOutsideModule } from 'ng-click-outside';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';
import { FileNamePipe } from './pipes/file-name.pipe';
@NgModule({
  declarations: [
    AppComponent,
    FileComponent,
    HomeComponent,
    FileNamePipe
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    NgxElectronModule,
    MatMenuModule,
    ClickOutsideModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
