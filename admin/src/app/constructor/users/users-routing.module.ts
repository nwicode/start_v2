import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsersComponent} from './users.component';
import {UserEditComponent} from './user-edit/user-edit.component';

const routes: Routes = [
    {
        path: '',
        component: UsersComponent,
        children: []
    },
    {
        path: 'add',
        component: UserEditComponent,
    },
    {
        path: 'edit/:id',
        component: UserEditComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {
}
