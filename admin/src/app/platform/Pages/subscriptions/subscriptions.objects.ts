import {User} from '../../../constructor/users/users.objects';
import {subscribeOn} from 'rxjs/operators';

export class UserSubscription {
    public id: number;
    public userId: number;
    public user: User;
    public subscriptionId: number;
    public writeOffDate: any;
    public nextWriteOffDate: any;
    public isOnetimePayment: any;
    public amount: number;
    public period: string;
    public isCanceled: any;
    public createdAt: string;
    public updatedAt: string;

    constructor() {
        this.id = 0;
        this.createdAt = '';
        this.updatedAt = '';
    }

    setData(json: any) {
        this.id = json['id'];
        this.user = json['user'];
        this.userId = json['user_id'];
        this.subscriptionId = json['subscription_id'];
        this.writeOffDate = json['write_off_date'];
        this.nextWriteOffDate = json['next_write_off_date'];
        this.isOnetimePayment = json['is_onetime_payment'];
        this.amount = json['amount'];
        this.period = json['period'];
        this.isCanceled = json['is_canceled'];
        this.createdAt = json['created_at'];
        this.updatedAt = json['updated_at'];
    }
}

export class PaginatedUserSubscriptions{
    public data: UserSubscription[];
    public firstPageUrl = '';
    public lastPageUrl = '';
    public nextPageUrl = '';
    public prevPageUrl = '';
    public path = '';
    public currentPage = 0;
    public perPage = 0;
    public lastPage = 0;
    public total = 0;
    public from = 0;
    public to = 0;

    constructor() {
        this.data = [];
        this.firstPageUrl = '';
        this.lastPageUrl = '';
        this.nextPageUrl = '';
        this.prevPageUrl = '';
        this.path = '';
        this.currentPage = 0;
        this.perPage = 0;
        this.lastPage = 0;
        this.total = 0;
        this.from = 0;
        this.to = 0;
    }

    parseData(json: any): PaginatedUserSubscriptions {
        const paginatedSubscriptions = new PaginatedUserSubscriptions();
        paginatedSubscriptions.setData(json);
        return paginatedSubscriptions;
    }

    setData(json: any) {
        this.firstPageUrl = json['first_page_url'];
        this.lastPageUrl = json['last_page_url'];
        this.nextPageUrl = json['next_page_url'];
        this.prevPageUrl = json['prev_page_url'];
        this.path = json['path'];
        this.currentPage = json['current_page'];
        this.perPage = json['per_page'];
        this.lastPage = json['last_page'];
        this.total = json['total'];
        this.from = json['from'];
        this.to = json['to'];
        this.data = json['data'].map(item => {
            const subscription = new UserSubscription();
            subscription.setData(item);
            return subscription;
        });
    }
}