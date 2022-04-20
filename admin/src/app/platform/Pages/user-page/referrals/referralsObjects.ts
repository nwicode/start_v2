import {User} from '../../../../constructor/users/users.objects';
import {ReferralProgram} from "../../settings-referrals/settings-referrals.objects";

export class UserReferralLink {
    public id: number;
    public userId: number;
    public user: User;
    public referralProgramId: number;
    public referralProgram: ReferralProgram;
    public code: string;
    public users: User[];
    public createdAt: string;
    public updatedAt: string;

    constructor() {
        this.id = 0;
        this.createdAt = '';
        this.updatedAt = '';
    }

    static from(json: any) {
        const userReferralLink = new UserReferralLink();
        userReferralLink.setData(json);
        return userReferralLink;
    }

    setData(json: any) {
        this.id = json['id'];
        this.user = json['user'];
        this.userId = json['user_id'];
        this.referralProgramId = json['referral_program_id'];
        this.referralProgram = json['referral_program'] != null ? ReferralProgram.from(json['referral_program']) : null;
        this.code = json['code'];
        this.users = json['users'];
        this.createdAt = json['created_at'];
        this.updatedAt = json['created_at'];
    }
}

export class UserReferral {
    public id: number;
    public userId: number;
    public user: User;
    public referralLinkId: number;
    public referralLink: UserReferralLink;
    public createdAt: string;
    public updatedAt: string;

    constructor() {
        this.id = 0;
        this.createdAt = '';
        this.updatedAt = '';
    }

    setData(json: any) {
        console.log('UserReferral', json);
        this.id = json['id'];
        this.user = json['user'];
        this.userId = json['user_id'];
        this.referralLinkId = json['referral_link_id'];
        this.referralLink = json['referral_link'] != null ? UserReferralLink.from(json['referral_link']) : null;
        this.createdAt = json['created_at'];
        this.updatedAt = json['updated_at'];
    }
}

export class UserReferralsPagination {
    public data: UserReferral[];
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

    parseData(json: any): UserReferralsPagination {
        const paginatedSubscriptions = new UserReferralsPagination();
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
