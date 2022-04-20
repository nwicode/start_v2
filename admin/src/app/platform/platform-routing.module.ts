import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PlatformComponent} from './platform.component';
import {RoleAdminGuard} from '../guards/role-admin.guard';
import {EditAppComponent} from './Pages/edit-app/edit-app.component';

const routes: Routes = [

    {
        path: '',
        component: PlatformComponent,
        children: [
            {
                path: 'dashboard',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/dash-board/dash-board.module').then((m) => m.DashBoardModule),
                data: {roles: [1]}
            },
            {
                path: 'subscriptions',
                loadChildren: () => import('./Pages/subscription/subscription.module').then((m) => m.SubscriptionModule),
                data: {roles: [1, 2]}
            },
            {
                path: 'user-page',
                loadChildren: () => import('./Pages/user-page/user-page.module').then((m) => m.UserPageModule),
            },
            {
                path: 'languages',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/languages/languages.module').then((m) => m.LanguagesModule),
                data: {roles: [1]}
            },
            {
                path: 'translations',
                loadChildren: () => import('./Pages/translations/translations.module').then((m) => m.TranslationsModule),
                data: {roles: [1]}

            },
            {
                path: 'static-pages',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/static-pages/static-pages.module').then((m) => m.StaticPagesModule),
                data: {roles: [1]}
            },
            {
                path: 'mail-templates',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/mail-templates/mail-templates.module').then((m) => m.MailTemplatesModule),
                data: {roles: [1]}
            },
            {
                path: 'settings-meta',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/settings-meta/settings-meta.module').then((m) => m.SettingsMetaModule),
                data: {roles: [1]}
            },
            {
                path: 'create_app',
                loadChildren: () => import('./Pages/create-app/create-app.module').then((m) => m.CreateAppModule)
            },
            {
                path: 'edit_app/:app_id',
                component: EditAppComponent
            },
            {
                path: 'settings-web',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/settings-web/settings-web.module').then((m) => m.SettingsWebModule),
                data: {roles: [1]}
            },
            {
                path: 'settings-smtp',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/settings-smtp/settings-smtp.module').then((m) => m.SettingsSmtpModule),
                data: {roles: [1]}
            },
            {
                path: 'settings-assets',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/settings-assets/settings-assets.module').then((m) => m.SettingsAssetsModule),
                data: {roles: [1]}
            },
            {
                path: 'currency',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/currency/currency.module').then((m) => m.CurrencyModule),
                data: {roles: [1]}
            },
            {
                path: 'apps',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/application-list/application-list.module').then((m) => m.ApplicationListModule),
                data: {roles: [1]}
            },
            {
                path: 'activity-log',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/activity-log/activity-log.module').then((m) => m.ActivityLogModule),
                data: {roles: [1]}
            },
            {
                path: 'marketplace',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/market-place/market-place.module').then((m) => m.MarketPlaceModule),
                data: {roles: [1]}
            },
            {                
                path: 'build-queue',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/build-queue/build-queue.module').then((m) => m.BuildQueueModule),
                data: {roles: [1]}
            },
            {
                path: 'settings-sdk',
                canActivate: [RoleAdminGuard],
                loadChildren: () => import('./Pages/settings-sdk/settings-sdk.module').then((m) => m.SettingsSdkModule),
                data: {roles: [1]}
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {path: '**', redirectTo: 'error/404'},
        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlatformRoutingModule {
}
