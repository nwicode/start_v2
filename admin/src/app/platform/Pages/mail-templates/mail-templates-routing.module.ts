import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailTemplatesComponent } from "./mail-templates.component";
import { MailTemplatesEditorComponent } from "./mail-templates-editor/mail-templates-editor.component";

const routes: Routes = [
    {
        path: '',
        component: MailTemplatesComponent,
        children : [
            { path: ':code', component: MailTemplatesEditorComponent },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MailTemplatesRoutingModule { }
