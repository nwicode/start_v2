import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./platform/platform.module').then((m) => m.PlatformModule),
  },
  {
    path: 'constructor/:app_id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./constructor/constructor.module').then((m) => m.ConstructorModule),
  },
  {
    path: 'preview/:app_id',
    loadChildren: () => import('./preview/preview.module').then((m) => m.PreviewModule),
  },
  {
    path: 'preview-tablet/:app_id',
    loadChildren: () => import('./preview-tablet/preview-tablet.module').then((m) => m.PreviewTabletModule),
  },
  {
    path: 'privacy/:unique_string_id',
    loadChildren: () => import('./app-privacy/app-privacy.module').then((m) => m.AppPrivacyModule),

  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
