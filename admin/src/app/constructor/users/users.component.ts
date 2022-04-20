import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GroupingState, PaginatorState, SortState} from '../../platform/framework/shared/crud-table';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ApplicationUsersService} from '../../services/application-users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDeleteComponent} from './user-delete/user-delete.component';
import {UsersDeleteComponent} from './users-delete/users-delete.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    public paginator: PaginatorState;
    public pageSizes: number[] = [25, 50, 100, 500];
    public sorting: SortState;
    public grouping: GroupingState;
    public isLoading: boolean;
    public filterGroup: FormGroup;
    public searchGroup: FormGroup;
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    applicationId: number;
    constructor(private fb: FormBuilder,
                 private router: Router, 
                private modalService: NgbModal,
                public applicationUsersService: ApplicationUsersService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

        console.log('APP_ID-USERS', this.applicationUsersService.getAppId());
        
        this.filterForm();
        this.searchForm();
        this.applicationUsersService.fetch();
        const sb = this.applicationUsersService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
        this.grouping = this.applicationUsersService.grouping;
        this.paginator = this.applicationUsersService.paginator;
        this.sorting = this.applicationUsersService.sorting;
        this.applicationUsersService.fetch();
    }

    // filtration
    filterForm() {
        this.filterGroup = this.fb.group({
            blocked: [''],
            condition: [''],
            searchTerm: [''],
        });
        this.subscriptions.push(
            this.filterGroup.controls.blocked.valueChanges.subscribe(() =>
                this.filter()
            )
        );
    }

    filter() {
        const filter = {};
        const status = this.filterGroup.get('blocked').value;
        if (status) {
            filter['blocked'] = status;
        }
        this.applicationUsersService.patchState({filter});
    }

    // search
    searchForm() {
        this.searchGroup = this.fb.group({
            searchTerm: [''],
        });
        const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
            .pipe(
                /*
          The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
          we are limiting the amount of server requests emitted to a maximum of one every 150ms
          */
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.search(val));
        this.subscriptions.push(searchEvent);
    }

    search(searchTerm: string) {
        this.applicationUsersService.patchState({searchTerm});
    }

    // pagination
    paginate(paginator: PaginatorState) {
        console.log('paginator', paginator);
        this.applicationUsersService.patchState({paginator});
    }

    // sorting
    sort(column: string) {
        const sorting = this.sorting;
        const isActiveColumn = sorting.column === column;
        if (!isActiveColumn) {
            sorting.column = column;
            sorting.direction = 'asc';
        } else {
            sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
        }
        this.applicationUsersService.patchState({sorting});
    }

    delete(id: number) {
        const modalRef = this.modalService.open(UserDeleteComponent);
        modalRef.componentInstance.id = id;
        modalRef.result.then(
            () => this.applicationUsersService.fetch(),
            () => {
            }
        );
    }

    deleteSelected() {
        const modalRef = this.modalService.open(UsersDeleteComponent);
        modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        modalRef.result.then(
            () => this.applicationUsersService.fetch(),
            () => {
            }
        );
    }
}
