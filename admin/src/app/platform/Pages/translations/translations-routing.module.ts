import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationsComponent } from "./translations.component";
import { EditTranslationsComponent } from "./edit-translations/edit-translations.component";

const routes: Routes = [
    {
        path: '',
        component: TranslationsComponent,
        children : [
            {
                path: 'edit-translation/:lang_id',
                component: EditTranslationsComponent,
            },
            { path: '', redirectTo: 'edit-translation/1', pathMatch: 'full' },
            { path: '**', redirectTo: 'edit-translation/1', pathMatch: 'full' }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TranslationsRoutingModule { }
