import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GalleryDialogComponent} from './gallery-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MyImagesComponent} from './components/my-images/my-images.component';
import {DropboxImagesComponent} from './components/dropbox-images/dropbox-images.component';
import {AdobeImagesComponent} from './components/adobe-images/adobe-images.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';
import {OAuthModule} from 'angular-oauth2-oidc';
import { LocalDiskImagesComponent } from './components/local-disk-images/local-disk-images.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    exports: [GalleryDialogComponent, MyImagesComponent, AdobeImagesComponent, DropboxImagesComponent],
    declarations: [GalleryDialogComponent, MyImagesComponent, DropboxImagesComponent, AdobeImagesComponent, LocalDiskImagesComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatTabsModule,
        MatProgressBarModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatProgressSpinnerModule,
        TranslateModule,
        HttpClientModule,
        OAuthModule.forRoot()
    ],

})
export class GalleryDialogModule {
}
