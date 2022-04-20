import {BaseModel} from '../../platform/framework/shared/crud-table';

export interface User extends BaseModel {
    id: number;
    app_id: string;
    name: string;
    lastname: string;
    mail: string;
    phone: string;
    password: string;
    balance: number;
    role: number;
    blocked: boolean;
    avatar: string;
    last_date: string;
}
