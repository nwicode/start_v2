import {Inject, Injectable, OnDestroy} from '@angular/core';
import {ITableState, TableResponseModel, TableService} from '../platform/framework/shared/crud-table';
import {User} from '../constructor/users/users.objects';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {exhaustMap, map} from 'rxjs/operators';
import {baseFilter} from '../_fake/fake-helpers/http-extenstions';
import {Product} from '../modules/e-commerce/_models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ApplicationUsersService extends TableService<User> implements OnDestroy {
    API_URL = `${environment.apiUrl}api/application_users`;
    private appId: any;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }

    // READ
    find(tableState: ITableState): Observable<TableResponseModel<User>> {
        console.log('tableState', tableState);
        return this.http.get<User[]>(this.API_URL + "/"+this.appId+"/").pipe(map((response: User[]) => {
                const filteredResult = baseFilter(response, tableState);
                const result: TableResponseModel<User> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })
        );
    }

    deleteItems(ids: number[] = []): Observable<any> {
        const tasks$ = [];
        ids.forEach(id => {
            tasks$.push(this.delete(1,id));
        });
        return forkJoin(tasks$);
    }

    updateStatusForItems(ids: number[], status: number): Observable<any> {
        return this.http.get<Product[]>(this.API_URL).pipe(
            map((products: Product[]) => {
                return products.filter(c => ids.indexOf(c.id) > -1).map(c => {
                    c.status = status;
                    return c;
                });
            }),
            exhaustMap((products: Product[]) => {
                const tasks$ = [];
                products.forEach(product => {
                    tasks$.push(this.update(product));
                });
                return forkJoin(tasks$);
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    setAppId(appID: any) {
        this.appId = appID;
    }

    getAppId() {
        return this.appId;
    }
}
