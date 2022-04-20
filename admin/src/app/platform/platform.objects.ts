export abstract class ModelPagination<T extends ModelObject> {
    public data: T[] = [];
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
        this.data = this.getDataArray(json['data'] != null ? json['data'] : []);
    }

    abstract getDataArray(data: any[]): T[];

    abstract fromJson(json: any): ModelPagination<T>;
}

export abstract class ModelObject {
    public id: number;

    abstract setData(json: any): void;

    abstract fromJson(json: any): ModelObject;
}

export class Item extends ModelObject {
    public id: number;

    fromJson(json: any): Item {
        const data = new Item();
        data.setData(json);
        return data;
    }

    setData(json: any): void {
        this.id = json['id'];
    }
}

export class Items extends ModelObject {
    public ids: any[];

    fromJson(json: any): Item {
        const data = new Item();
        data.setData(json);
        return data;
    }

    setData(json: any): void {
        this.id = json['ids'];
    }
}