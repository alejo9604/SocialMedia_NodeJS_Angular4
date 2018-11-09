import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { app_routing } from './app.routes';

//Plugins
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'

//Services
// import { AuthService } from './services/auth.service';
// import { AuthGuardService } from './services/auth-guard.service';
import { AlbumService } from './services/album.service';
import { PhotoService } from './services/photo.service';
import { SignService } from './services/sign.service';
import { AuthGuard } from './services/auth.guard';
import { GeneralService } from './services/general.service';

//Pipes
import { DefaultImagePipe } from './pipes/default-image.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { FilePreviewPipe } from './pipes/file-preview.pipe';
import { OrderPipe } from './pipes/order.pipe';

//Directives
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';
import { NgInputFileDirective } from './directives/ng-input-file.directive';

//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MyAlbumsComponent } from './components/myalbums/myalbums.component';
import { PreviewComponent } from './components/myalbums/preview.component';
import { NewAlbumComponent } from './components/new-album/new-album.component';
import { EditAlbumComponent } from './components/edit-album/edit-album.component';
import { UploadPhotoComponent } from './components/edit-album/upload-photo/upload-photo.component';
import { PhotoComponent } from './components/photo/photo.component';
import { DeleteAlbumComponent } from './components/edit-album/delete-album/delete-album.component';
import { SingUpComponent } from './components/sing-up/sing-up.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { LoginHomeComponent } from './components/home/login-home.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MyAlbumsComponent,
    PreviewComponent,
    DefaultImagePipe,
    CapitalizePipe,
    NewAlbumComponent,
    EditAlbumComponent,
    NgDropFilesDirective,
    UploadPhotoComponent,
    FilePreviewPipe,
    OrderPipe,
    PhotoComponent,
    DeleteAlbumComponent,
    SingUpComponent,
    NgInputFileDirective,
    EditUserComponent,
    LoginHomeComponent,
    AlbumsComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Angular2FontawesomeModule,
    app_routing
  ],
  providers: [
    // AuthService,
    // AuthGuardService,
    AlbumService,
    PhotoService,
    SignService,
    GeneralService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
