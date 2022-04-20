export class StripeBillingConfig {
    public name: string;
    public email: string;
    public userId: any;
    public priseId: string;
    public isRecurrent: boolean;

    constructor(name: string, email: string, userId: any, priseId: string, isRecurrent: boolean) {
        this.name = email;
        this.email = email;
        this.userId = userId;
        this.priseId = priseId;
        this.isRecurrent = isRecurrent;
    }
}