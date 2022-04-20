import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {UserSubscription} from '../platform/Pages/subscriptions/subscriptions.objects';
import {GroupingState, ITableState, PaginatorState, SortState, TableResponseModel} from '../platform/framework/shared/crud-table';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, finalize, tap} from 'rxjs/operators';
import {Payment} from '../platform/Pages/payments/payments.objects';

const DEFAULT_STATE: ITableState = {
    filter: {},
    paginator: new PaginatorState(),
    sorting: new SortState(),
    searchTerm: '',
    grouping: new GroupingState(),
    entityId: undefined
};

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    private items = new BehaviorSubject<Payment[]>([]);
    private isLoading$ = new BehaviorSubject<boolean>(false);
    private total$ = new BehaviorSubject<number>(0);
    private errorMessage = new BehaviorSubject<string>('');
    private tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
    private subscriptions: Subscription[] = [];
    private API_URL = `${environment.apiUrl}api/payments`;

    constructor(private http: HttpClient) {
    }

    getPayments(parameter: HttpParams = new HttpParams()) {
        this.isLoading$.next(true);
        this.http.get(this.API_URL, {params: parameter})
            .pipe(
                tap((res: TableResponseModel<Payment>) => {
                }),
            ).subscribe(res => {
            const items = res.items.map(item => {
                const payment = new Payment();
                payment.setData(item);
                return payment;
            });
            this.total$.next(res.total);
            this.items.next(items);
            this.isLoading$.next(false);
        });
    }

    get payments() {
        return this.items.asObservable();
    }

    get total() {
        return this.total$.asObservable();
    }

    get isLoading() {
        return this.isLoading$.asObservable();
    }

    // State getters
    get paginator() {
        return this.tableState$.value.paginator;
    }

    get filter() {
        return this.tableState$.value.filter;
    }

    get sorting() {
        return this.tableState$.value.sorting;
    }

    get searchTerm() {
        return this.tableState$.value.searchTerm;
    }

    get grouping() {
        return this.tableState$.value.grouping;
    }
}
