import {UserReferral} from '../user-page/referrals/referralsObjects';
import {environment} from "../../../../environments/environment.prod";

export class ReferralProgram {
    public id: number;
    public name: string;
    public uri: string;
    public lifeTimeMinutes: number;
    public createdAt: string;
    public updatedAt: string;

    constructor() {
        this.id = 0;
        this.name = '';
        this.uri = '';
        this.lifeTimeMinutes = 0;
        this.createdAt = '';
        this.updatedAt = '';
    }

    static from(json: any) {
        console.log('json', json);
        const referralProgram = new ReferralProgram();
        referralProgram.setData(json);
        return referralProgram;
    }

    setData(json: any) {
        this.id = json['id'];
        this.name = json['name'];
        this.uri = json['uri'];
        this.lifeTimeMinutes = json['lifetime_minutes'];
        this.createdAt = json['created_at'];
        this.updatedAt = json['updated_at'];
    }

    getFullUri() {
        return environment.apiUrl + this.uri;
    }
}

export class ReferralProgramsPagination {
    public data: ReferralProgram[];
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

    parseData(json: any): ReferralProgramsPagination {
        const paginatedSubscriptions = new ReferralProgramsPagination();
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
            const subscription = new UserReferral();
            subscription.setData(item);
            return subscription;
        });
    }
}