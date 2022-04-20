import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable, of, Subscription} from 'rxjs';
import {UserSubscription} from '../platform/Pages/subscriptions/subscriptions.objects';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {GroupingState, ITableState, PaginatorState, SortState, TableResponseModel} from '../platform/framework/shared/crud-table';

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
export class UserSubscriptionService {
    private items = new BehaviorSubject<UserSubscription[]>([]);
    private isLoading$ = new BehaviorSubject<boolean>(false);
    private total$ = new BehaviorSubject<number>(0);
    private errorMessage = new BehaviorSubject<string>('');
    private tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
    private subscriptions: Subscription[] = [];
    private API_URL = `${environment.apiUrl}api/subscriptions`;

    constructor(private http: HttpClient) {
    }

    getSubscriptions(parameter: HttpParams = new HttpParams()) {
        this.isLoading$.next(true);
        this.http.get(this.API_URL, {params: parameter})
            .pipe(
                tap((res: TableResponseModel<UserSubscription>) => {
                }),
            ).subscribe(res => {
            const items = res.items.map(item => {
                const subscription = new UserSubscription();
                subscription.setData(item);
                return subscription;
            });
            this.total$.next(res.total);
            this.items.next(items);
            this.isLoading$.next(false);
        });
    }
    deleteSubscription(id: any): Observable<any> {
        this.isLoading$.next(true);
        const url = `${this.API_URL}/${id}`;
        return this.http.delete(url).pipe(
            catchError(err => {
                return of({});
            }),
            finalize(() => this.isLoading$.next(false))
        );
    }

    get subscriptionItems() {
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
