export interface ILicense {
    id: number;
    registered_to: string;
    license_key: string;
    product_id: string;
    product_edition: string;
    number_of_sites: string;
    maximum_users: string;
    is_active: boolean;
    start_datetime: any;
    end_datetime: any;
    created_at: string;
    updated_at: string;
}

export class License {
    id: number;
    registeredTo: string;
    licenseKey: string;
    productId: string;
    productEdition: string;
    numberOfSites: string;
    maximumUsers: string;
    isActive: boolean;
    startDatetime: any;
    endDatetime: any;
    createdAt: string;
    updatedAt: string;

    constructor(id: number, registeredTo: string, licenseKey: string, productId: string, productEdition: string, numberOfSites: string,
                maximumUsers: string, isActive: boolean, startDatetime: any, endDatetime: any, createdAt: string, updatedAt: string) {
        this.id = id;
        this.registeredTo = registeredTo;
        this.licenseKey = licenseKey;
        this.productId = productId;
        this.productEdition = productEdition;
        this.numberOfSites = numberOfSites;
        this.maximumUsers = maximumUsers;
        this.isActive = isActive;
        this.startDatetime = startDatetime;
        this.endDatetime = endDatetime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static factory(): License {
        return new License(0, '', '', '', '', '', '',
            false, '', '', '', '');
    }

    static getData(item: ILicense): License {
        return new License(item.id, item.registered_to, item.license_key, item.product_id, item.product_edition, item.number_of_sites,
            item.maximum_users, item.is_active, item.start_datetime, item.end_datetime, item.created_at, item.updated_at);
    }
}

export class LicenseState {
    status: boolean;
    message: string;

    constructor(status: boolean, message: string) {
        this.status = status;
        this.message = message;
    }

    static factory(): LicenseState {
        return new LicenseState(false, '');
    }
}
