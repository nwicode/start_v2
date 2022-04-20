import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";

@Injectable({
    providedIn: 'root'
})
export class CollectionService {

    constructor(private request:RequestService) { }

    /**
     * Get collection list
     *
     * @param appId application id
     */
    public async getCollectionList(appId) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/getCollectionList", {appId: appId});
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Create new collection.
     *
     * @param appId application id
     * @param name collection name
     * @param fields collection fields
     * @param emails emails
     * @param next_field_id id for next field in collection
     */
    public async createCollection(appId, name, fields, emails, next_field_id) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/createCollection", {
                appId: appId,
                name: name,
                fields: fields,
                emails: emails,
                next_field_id: next_field_id
            });
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Edit collection.
     *
     * @param appId application id
     * @param collectionId collection id
     * @param name collection name
     * @param fields collection fields
     * @param emails emails
     * @param next_field_id id for next field in collection
     */
    public async editCollection(appId, collectionId, name, fields, emails, next_field_id) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/editCollection", {
                appId: appId,
                collectionId: collectionId,
                name: name,
                fields: fields,
                emails: emails,
                next_field_id: next_field_id
            });
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Get collection by id.
     *
     * @param appId application id
     * @param collectionId collection id
     */
    public async getCollection(appId, collectionId) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/getCollection", {
                appId: appId,
                collectionId: collectionId
            });
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Get records list.
     *
     * @param appId application id
     * @param collectionId collection id
     */
    public async getCollectionRecordsList(appId, collectionId) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/getCollectionRecordsList", {
                appId: appId,
                collectionId: collectionId
            });
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Create new record.
     *
     * @param appId application id
     * @param collectionId collection id
     * @param values field values
     */
    public async createCollectionRecord(appId, collectionId, values) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/createCollectionRecord", {
                appId: appId,
                collectionId: collectionId,
                values: values
            });
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Edit record.
     *
     * @param appId application id
     * @param recordId record id
     * @param values new field values
     */
    public async editCollectionRecord(appId, recordId, values) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/editCollectionRecord", {
                appId: appId,
                recordId: recordId,
                values: values
            });
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Get collection record.
     *
     * @param appId application id
     * @param recordId record id
     */
    public async getCollectionRecord(appId, recordId) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/getCollectionRecord", {
                appId: appId,
                recordId: recordId
            });
            data.is_error = false;
            result = data;
        } catch (error) {
            error.is_error = true;
            result = error;
        }
        return result;
    }

    /**
     * Delete record.
     *
     * @param appId application id
     * @param recordId record id
     */
    public async deleteCollectionRecord(appId, recordId) {
        let result:any;
        try {
            let data =  await this.request.makePostRequest("api/deleteCollectionRecord", {
                appId: appId,
                recordId: recordId
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
