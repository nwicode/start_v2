import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {of, Subscription} from 'rxjs';
import {ApplicationUsersService} from '../../../services/application-users.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError, delay, finalize, tap} from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-delete',
    templateUrl: './user-delete.component.html',
    styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit, OnDestroy {
    @Input() id: number;
    isLoading = false;
    subscriptions: Subscription[] = [];
    applicationId: number;
    constructor(private router: Router, private applicationUsersService: ApplicationUsersService, public modal: NgbActiveModal) {
        
    }

    ngOnInit(): void {
        this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    }

    deleteProduct() {
        this.isLoading = true;
        const sb = this.applicationUsersService.delete(this.applicationId, this.id).pipe(
            delay(1000), // Remove it from your code (just for showing loading)
            tap(() => this.modal.close()),
            catchError((err) => {
                this.modal.dismiss(err);
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
