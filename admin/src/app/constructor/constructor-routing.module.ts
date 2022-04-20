import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ConstructorComponent} from './constructor.component';
import {RoleAdminGuard} from "../guards/role-admin.guard";

const routes: Routes = [
    {
        path: '',
        component: ConstructorComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
            },
            {
                path: 'layouts',
                loadChildren: () => import('./layouts/layouts.module').then((m) => m.LayoutsModule),
            },
            {
                path: 'colors',
                loadChildren: () => import('./colors/colors.module').then((m) => m.ColorsModule),
            },
            {
                path: 'spcontent',
                loadChildren: () => import('./spcontent/spcontent.module').then((m) => m.SPContentModule),
            },
            {
                path: 'languages',
                loadChildren: () => import('./languages/languages.module').then((m) => m.LanguagesModule),
            },
            {
                path: 'admob-settings',
                loadChildren: () => import('./admob-settings/admob-settings.module').then((m) => m.AdmobSettingsModule),
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
            },
            {
                path: 'build',
                loadChildren: () => import('./build/build.module').then((m) => m.BuildModule),
            },
            {
                path: 'editor-css',
                loadChildren: () => import('./editor-css/editor-css.module').then((m) => m.EditorCssModule),
            },
            {
                path: 'onesignal',
                loadChildren: () => import('./one-signal-settings/one-signal-settings.module').then((m) => m.OneSignalSettingsModule),
            },
            {
                path: 'firebase-settings',
                loadChildren: () => import('./firebase-settings/firebase-settings.module').then((m) => m.FirebaseSettingsModule),
            },
            {
                path: 'analytics-settings',
                loadChildren: () => import('./analytics-settings/analytics-settings.module')
                    .then((m) => m.AnalyticsSettingsModule),
            },
            {
                path: 'custom-start-animation',
                loadChildren: () => import('./custom-start-animation/custom-start-animation.module')
                    .then((m) => m.CustomStartAnimationModule),
            },
            {
                path: 'push-messages',
                loadChildren: () => import('./push-messages/push-messages.module').then((m) => m.PushMessagesModule),
            },
            {
                path: 'mixpanel',
                loadChildren: () => import('./mix-panel-settings/mix-panel-settings.module').then((m) => m.MixPanelSettingsModule),
            },
            {
                path: 'custom-code',
                loadChildren: () => import('./custom-code/custom-code.module').then((m) => m.CustomCodeModule),
            },
            {
                path: 'create-content-type',
                loadChildren: () => import('./create-content-type/create-content-type.module').then((m) => m.CreateContentTypeModule),
            },
            {
                path: 'edit-content-type/:content_type_id',
                loadChildren: () => import('./edit-content-type/edit-content-type.module').then((m) => m.EditContentTypeModule),
            },
            {
                path: 'content',
                loadChildren: () => import('./content/content.module').then((m) => m.ContentModule),
            },
            {
                path: 'content-type-list',
                loadChildren: () => import('./content-type-list/content-type-list.module').then((m) => m.ContentTypeListModule),
            },
            {
                path: 'application-menu',
                loadChildren: () => import('./application-menu/application-menu.module').then((m) => m.ApplicationMenuModule),
            },
            {
                path: 'application-translations',
                loadChildren: () => import('./application-translations/application-translations.module')
                    .then((m) => m.ApplicationTranslationsModule),
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
            },
            {
                path: 'news',
                loadChildren: () => import('./news/news.module').then((m) => m.NewsModule),
            },
            {
                path: 'fonts',
                loadChildren: () => import('./fonts/fonts.module').then((m) => m.FontsModule),
            },
            {
                path: 'collections',
                loadChildren: () => import('../constructor/collections/collections.module').then((m) => m.CollectionsModule),
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
export class ConstructorRoutingModule {
}
