import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginHomeComponent } from './components/home/login-home.component';
import { MyAlbumsComponent } from './components/myalbums/myalbums.component';
import { NewAlbumComponent } from './components/new-album/new-album.component';
import { EditAlbumComponent } from './components/edit-album/edit-album.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { AdminComponent } from './components/admin/admin.component';

import { AuthGuard } from "./services/auth.guard"

const app_routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'albums', component: MyAlbumsComponent, canActivate: [AuthGuard] },
  { path: 'newAlbum', component: NewAlbumComponent, canActivate: [AuthGuard] },
  { path: 'editAlbum/:albumId', component: EditAlbumComponent, canActivate: [AuthGuard] },
  { path: 'editUser', component: EditUserComponent  , canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent  , canActivate: [AuthGuard] },
  { path: 'user/:userId/:albumId', component: AlbumsComponent  , canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const app_routing = RouterModule.forRoot(app_routes);
