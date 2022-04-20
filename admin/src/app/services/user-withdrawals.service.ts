import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {
    GroupingState,
    ITableState,
    PaginatorState,
    SortState,
    TableResponseModel
} from '../platform/framework/shared/crud-table';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, finalize, tap} from 'rxjs/operators';
import {UserWithdrawal} from '../platform/Pages/user-page/withdrawals/withdrawalsObjects';


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
export class UserWithdrawalsService {
    private items = new BehaviorSubject<UserWithdrawal[]>([]);
    public isLoading$ = new BehaviorSubject<boolean>(false);
    private total$ = new BehaviorSubject<number>(0);
    private errorMessage = new BehaviorSubject<string>('');
    private tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
    private subscriptions: Subscription[] = [];
    private API_URL = `${environment.apiUrl}api/user_withdrawal`;

    constructor(private http: HttpClient) {
    }

    getWithdrawals(parameter: HttpParams = new HttpParams()) {
        this.isLoading$.next(true);
        this.http.get(this.API_URL, {params: parameter})
            .pipe(
                tap((res: TableResponseModel<UserWithdrawal>) => {
                }),
            ).subscribe(res => {
            console.log('getWithdrawals', res);
            const items = res.items.map(item => {
                const userWithdrawal = new UserWithdrawal();
                userWithdrawal.setData(item);
                return userWithdrawal;
            });
            this.total$.next(res.total);
            this.items.next(items);
            this.isLoading$.next(false);
        });
    }

    addWithdrawal(userWithdrawal: UserWithdrawal): Observable<any> {
        this.isLoading$.next(true);
        const url = `${this.API_URL}`;
        return this.http.post(url, userWithdrawal);
    }

    updateWithdrawal(userWithdrawal: UserWithdrawal): Observable<any> {
        this.isLoading$.next(true);
        const url = `${this.API_URL}`;
        return this.http.patch(url, userWithdrawal);
    }

    deleteWithdrawals(id: any): Observable<any> {
        this.isLoading$.next(true);
        const url = `${this.API_URL}/${id}`;
        return this.http.delete(url).pipe(
            catchError(err => {
                return of({});
            }),
            finalize(() => this.isLoading$.next(false))
        );
    }

    get withdrawalItems() {
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
