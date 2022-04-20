import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {RequestService} from "./request.service";
import {of} from "rxjs";

@Injectable()
export class PushMessageService {
    constructor(private http: HttpClient, private request:RequestService) {}

    /**
     * Create new push message and save it in our data base.
     *
     * @param restApiKey OneSignal rest api key
     * @param message message object
     * @param appId application id
     * @param fullText text associated with message
     */
    public async createNotificationWithSaveInOurDataBase(restApiKey: string, message: any, appId: string|number, fullText: string) {
        let result: any;
        try {
            let messageImage = message.large_icon;
            message.large_icon = 'https://nwicode.com/' + message.large_icon;

            let data: any = await this.http.post("https://onesignal.com/api/v1/notifications", JSON.stringify(message),
                {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json;charset=utf-8",
                        "Authorization": "Basic " + restApiKey })
                }).toPromise().then(response => {
                    let responseData = {
                        appId: appId,
                        pushId: (<any>response).id,
                        title: message.headings.en,
                        message: message.contents.en,
                        fullText: fullText,
                        image: messageImage,
                        sentDate: message.send_after ? message.send_after : new Date().toUTCString(),
                        status: 0
                    };

                    if (!(<any>response).errors) {
                        responseData.status = 1;
                    }

                    return this.request.makePostRequest('api/saveApplicationPushMessage', responseData);
            });

            data.is_error = false;
            result = data;
        }  catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Create new push message.
     *
     * @param restApiKey OneSignal rest api key
     * @param message message object
     */
    public async createNotification(restApiKey: string, message: any) {
        let result: any;
        message.large_icon = 'https://nwicode.com/' + message.large_icon;
        try {
            let data: any = await this.http.post("https://onesignal.com/api/v1/notifications", JSON.stringify(message),
                {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json;charset=utf-8",
                        "Authorization": "Basic " + restApiKey })
                }).toPromise();
            data.is_error = false;
            result = data;
        }  catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Get push messages list.
     *
     * @param appId
     * @param limit
     * @param offset
     */
    public async getPushMessagesList(appId: string|number, limit: number, offset: number) {
        let result: any;
        try {
            let data: any = await this.request.makePostRequest('api/getApplicationPushMessageList', {
                appId: appId,
                limit: limit,
                offset: offset
            });

            data.is_error = false;
            result = data;
        }  catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    public async getTopics(appId: string|number) {
        let result: any;
        try {
            let data: any = await this.request.makePostRequest('api/getTopics', {
                appId: appId
            });

            data.is_error = false;
            result = data;
        }  catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    public async setTopic(appId: string|number, topic_name, topic_id?) {
        let result: any;
        try {
            let data: any = await this.request.makePostRequest('api/setTopic', {
                appId: appId,
                name: topic_name,
                topic_id: topic_id
            });

            data.is_error = false;
            result = data;
        }  catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    public async deleteTopic(appId: string|number, topic_id) {
        let result: any;
        try {
            let data: any = await this.request.makePostRequest('api/deleteTopic', {
                appId: appId,
                topic_id: topic_id
            });

            data.is_error = false;
            result = data;
        }  catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }


}
