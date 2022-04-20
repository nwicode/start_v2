import {Injectable} from "@angular/core";
import {RequestService} from "./request.service";

@Injectable({
    providedIn: 'root'
})
/**
 * Methods and properties for ActivityLog.
 */
export class ActivityLogService {
    constructor(private request: RequestService) {
    }

    /**
     * Get list with log record for admin.
     *
     * @param limit count record
     * @param offset number skip record
     */
    public async getAdminActivityLogList(limit: number, offset: number) {
        let result: any;
        try {
            let data = await this.request.makePostRequest("api/getAdminActivityLogList", {
                limit: limit,
                offset: offset
            });

            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }

        return result;
    }
}
