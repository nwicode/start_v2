export class GoogleAnalyticRequest {
    public viewId: string;
    public startDate: string;
    public endDate: string;
    public metrics: GoogleAnalyticMetric[];
    public dimensions: GoogleAnalyticDimension[];

    constructor(viewId: string = null, startDate: string = null, endDate: string = null,
                metrics: GoogleAnalyticMetric[] = [], dimensions: GoogleAnalyticDimension[] = []) {
        this.viewId = viewId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.metrics = metrics;
        this.dimensions = dimensions;
    }

    toJson() {
        return this.toG4Json();
    }

    toG4Json() {
        return {
            property_id: this.viewId,
            start_date: this.startDate,
            end_date: this.endDate,
            metrics: this.metrics.map(item => item.toJson()),
            dimensions: this.dimensions.map(item => item.toJson()),
        };
    }

    toUAJson() {
        return {
            view_id: this.viewId,
            start_date: this.startDate,
            end_date: this.endDate,
            metrics: this.metrics,
            dimensions: this.dimensions,
        };
    }
}

export class GoogleAnalyticMetric {
    public expression: string;
    public alias: string;

    constructor(expression: string = null, alias: string = null) {
        this.expression = expression;
        this.alias = alias;
    }

    toJson() {
        return this.toG4Json();
    }

    toG4Json() {
        return {name: this.expression};
    }

    toUAJson() {
        return {expression: this.expression, alias: this.alias};
    }
}

export class GoogleAnalyticDimension {
    public name: string;

    constructor(name: string = null) {
        this.name = name;
    }
    toJson() {
        return {name: this.name};
    }
}

export class GoogleAnalyticResponse {
    public headers: any;
    public exception: any;
    public original: GoogleAnalyticReport;
}

export class GoogleAnalyticReport {
    public result: {
        metricHeaders: { name: string }[],
        dimensionHeaders: { name: string }[],
        rows: GoogleAnalyticDataRow[],
        rowCount: number,
        metadata: any,
        kind: any,
    };
}

export class GoogleAnalyticDataRow {
    public dimensionValues: { value: any }[];
    public metricValues: { value: any }[];

    constructor() {
        this.dimensionValues = [];
        this.metricValues = [];
    }
}

export class ArealChartSeries {
    public name: string;
    public data: number[];

    constructor(name: string = '', data: number[] = []) {
        this.name = name;
        this.data = data;
    }
}
