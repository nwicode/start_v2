import {Component, OnInit} from '@angular/core';
import {GroupingState, PaginatorState, SortState} from '../../framework/shared/crud-table';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {UserSubscriptionService} from '../../../services/user-subscription.service';
import {HttpParams} from '@angular/common/http';
import {UserSubscription} from './subscriptions.objects';
import {DeleteSubscriptionModalComponent} from './components/delete-subscription-modal/delete-subscription-modal.component';
import {CancelSubscriptionModalComponent} from './components/cancel-subscription-modal/cancel-subscription-modal.component';

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
    public pageSizeOptions: number[] = [25, 50, 100, 500];
    public loading = false;
    public start = 0;
    public limit = 25;
    public total = 25;
    public sorting: SortState;
    public grouping: GroupingState;
    public isLoading: boolean;
    public filterGroup: FormGroup;
    public searchGroup: FormGroup;
    public filterByStatus: string;
    public filterByPeriod: string;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                public userSubscriptionService: UserSubscriptionService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.searchForm();
        this.grouping = this.userSubscriptionService.grouping;
        // this.paginator = this.userSubscriptionService.paginator;
        this.sorting = new SortState();
        this.userSubscriptionService.getSubscriptions(this.getSubscriptionFilter());
        this.userSubscriptionService.isLoading.subscribe(
            data => {
                this.loading = data;
            }
        );
        this.userSubscriptionService.total.subscribe(
            data => {
                this.total = data;
            }
        );
    }

    private getSubscriptionFilter(): HttpParams {
        let param = new HttpParams()
            .set('start', String(this.start))
            .set('limit', String(this.limit));
        if (this.filterByStatus != null && this.filterByStatus !== 'null') {
            param = param.set('is_canceled', String(this.filterByStatus));
        }
        if (this.filterByPeriod != null && this.filterByPeriod !== 'null') {
            param = param.set('period', String(this.filterByPeriod));
        }
        return param;
    }

    filterByStatusSelection(data: any) {
        console.log('filter-status', data);
        this.filterByStatus = data;
        this.userSubscriptionService.getSubscriptions(this.getSubscriptionFilter());
    }

    filterByPeriodSelection(data: any) {
        console.log('filter-period', data);
        this.filterByPeriod = data;
        this.userSubscriptionService.getSubscriptions(this.getSubscriptionFilter());
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
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((val) => this.search(val));
    }

    search(searchTerm: string) {
        console.log('Searching', searchTerm);
        const filter = this.getSubscriptionFilter().set('search', searchTerm);
        this.userSubscriptionService.getSubscriptions(filter);
    }

    public updatePagination(event: any) {
        this.loading = true;
        this.start = event.pageIndex * event.pageSize;
        this.limit = event.pageSize;
        this.userSubscriptionService.getSubscriptions(this.getSubscriptionFilter());
    }

    // pagination
    paginate(paginator: PaginatorState) {
        console.log('paginator', paginator);
        // this.applicationUsersService.patchState({paginator});
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
        const filter = this.getSubscriptionFilter().set('|' + sorting.column, sorting.direction);
        console.log(filter);
        this.userSubscriptionService.getSubscriptions(filter);
    }

    cancelSubscription(subscription: UserSubscription) {
        const modalRef = this.modalService.open(CancelSubscriptionModalComponent);
        modalRef.componentInstance.id = subscription.id;
        modalRef.result.then(() => this.userSubscriptionService.getSubscriptions(this.getSubscriptionFilter()), () => {
        });
    }
}
