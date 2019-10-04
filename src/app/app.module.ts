import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { HomeComponent } from './home/home.component';


import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';
import { FileNamePipe } from './pipes/file-name.pipe';
import { RenameSheetComponent } from './rename-sheet/rename-sheet.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SliderComponent } from './slider/slider.component';
import { DrivefileComponent } from './drivefile/drivefile.component';
import { SliderItemDirective } from './slider-item.directive';
import { FiletableComponent } from './filetable/filetable.component'
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
@NgModule({
  declarations: [
    AppComponent,
    FileComponent,
    HomeComponent,
    FileNamePipe,
    RenameSheetComponent,
    SliderComponent,
    DrivefileComponent,
    SliderItemDirective,
    FiletableComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    NgxElectronModule,
    MatMenuModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSortModule,
    MatIconModule,
    NgScrollbarModule,
    PerfectScrollbarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [RenameSheetComponent]
})
export class AppModule { }
