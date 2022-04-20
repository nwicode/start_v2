import {Injectable} from '@angular/core';
import {RequestService} from './request.service';

@Injectable({
    providedIn: 'root'
})
export class StripeSubscriptionService {

    constructor(private request: RequestService) {
    }

    public async cancelSubscription(userId: string) {
        let result: any;
        try {
            return await this.request.makePostRequest('api/cancel_subscription', {user_id: userId});
        } catch (error) {
            result = error;
        }
        return result;
    }
}
