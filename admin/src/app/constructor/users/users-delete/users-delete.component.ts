import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {of, Subscription} from 'rxjs';
import {ApplicationUsersService} from '../../../services/application-users.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError, delay, finalize, tap} from 'rxjs/operators';

@Component({
    selector: 'app-users-delete',
    templateUrl: './users-delete.component.html',
    styleUrls: ['./users-delete.component.scss']
})
export class UsersDeleteComponent implements OnInit, OnDestroy {
    @Input() ids: number[];
    isLoading = false;
    subscriptions: Subscription[] = [];

    constructor(private applicationUsersService: ApplicationUsersService, public modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    deleteProducts() {
        this.isLoading = true;
        const sb = this.applicationUsersService.deleteItems(this.ids).pipe(
            delay(1000), // Remove it from your code (just for showing loading)
            tap(() => this.modal.close()),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(undefined);
            }),
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe();
        this.subscriptions.push(sb);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

}
