import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IoniconComponent} from './ionicon.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { SearchFilterPipe } from './search-filter.pipe';


@NgModule({
    exports: [IoniconComponent],
    declarations: [IoniconComponent, SearchFilterPipe],
    imports: [
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
        MatFormFieldModule,
    ]
})
export class IoniconDialogModule {
}
