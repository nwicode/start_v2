import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {TranslationService} from '../../services/translation.service';
import {ConstructorDasboardService} from '../../services/constructor-dasboard.service';
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {ApplicationService} from '../../services/application.service';
import {Router} from '@angular/router';
import {SubheaderService} from '../ConstructorComponents/subheader/_services/subheader.service';
import {UserService} from '../../services/user.service';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';
import {ArealChartSeries, GoogleAnalyticDimension, GoogleAnalyticMetric, GoogleAnalyticRequest} from './dashboard.objects';
import {
    ChartComponent,
    ApexXAxis,
    ApexTitleSubtitle,
    ApexDataLabels,
    ApexYAxis, ApexStroke, ApexLegend, ApexFill, ApexStates, ApexTooltip, ApexMarkers, ApexPlotOptions
} from 'ng-apexcharts';
import {DatePipe, formatDate} from '@angular/common';

export type ChartOptions = {
    series: any[];
    chart: any;
    xaxis: any;
    yaxis: any;
    title: ApexTitleSubtitle;
    subtitle: ApexTitleSubtitle;
    labels: string[];
    dataLabels: ApexDataLabels;
    responsive: any[];
    stroke: any;
    legend: any;
    fill: ApexFill;
    states: ApexStates;
    tooltip: ApexTooltip;
    colors: any[];
    markers: ApexMarkers;
    plotOptions: ApexPlotOptions;
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public dashboard: { news: any[], tariff: { disk_size_use: any, disk_size: any } } = {
        news: [],
        tariff: {disk_size_use: null, disk_size: null}
    };
    public appId: number;
    public isLoading$: Observable<boolean>;

    public totalInstall = new BehaviorSubject<string>('');
    public todayInstall = new BehaviorSubject<string>('');

    application: any;
    user: any;
    public googleAnalyticsViewID = null;
    public isLoading = false;
    public isGoogleAnalyticsConnected = new BehaviorSubject<boolean>(false);
    @ViewChild('devicesChart', {static: false}) devicesChart: ChartComponent;
    @ViewChild('installsChart', {static: false}) installsChart: ChartComponent;
    @ViewChild('pagePopularityChart', {static: false}) pagePopularityChart: ChartComponent;

    public chartOptions: Partial<ChartOptions>;
    public devicesChartOptions: Partial<ChartOptions>;
    public sizeChartOptions: Partial<ChartOptions>;
    public installsChartOptions: Partial<ChartOptions>;
    public pagePopularityChartOptions: Partial<ChartOptions>;

    is_loaded: boolean = false;

    constructor(private dasboardService: ConstructorDasboardService, private applicationService: ApplicationService,
                private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService,
                private router: Router, private changeDetectorRef: ChangeDetectorRef, private userService: UserService,
                private googleAnalyticsService: GoogleAnalyticsService) {
        this.sizeChartOptions = this.getRadialBarChartOption(23);
         this.devicesChartOptions = this.getRadialDonutChartOption([], []);
         this.installsChartOptions = this.getAreaChartOption([], []);
         this.pagePopularityChartOptions = this.getRadialDonutChartOption([], []);
    }

    ngOnInit(): void {
        this.appId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
        setTimeout(() => {
            this.subheader.setTitle('CONSTRUCTOR.DASHBOARD.TITLE');
            this.subheader.setBreadcrumbs([{
                title: 'CONSTRUCTOR.DASHBOARD.TITLE',
                linkText: '',
                linkPath: '/constructor/' + this.appId + '/app-settings'
            }]);
        }, 1);
        //
        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);

            Promise.all([this.applicationService.getApplicationById(this.appId), this.userService.current()]).then(response => {
                this.application = response[0];
                this.user = response[1];
            });
            this.applicationService.getAnalyticsSettings(this.appId).then(result => {
                this.googleAnalyticsViewID = result.google_analytics_view_id;
                if (this.googleAnalyticsViewID != null) {
                    observer.next(false);
                    // this.wasLoaded = true;
                    this.loadAnalyticsData();
                } else {
                    this.isGoogleAnalyticsConnected.next(true);
                }
            }, error => {
                this.isGoogleAnalyticsConnected.next(true);
            });

            this.dasboardService.getDashboard(this.appId).then(response => {
                if (!response.is_error) {
                    this.dashboard = response;
                    this.changeDetectorRef.detectChanges();
                    // this.wasLoaded = true;
                    // this.sizeChartOptions = this.makeSizeChartOptions();
                    // this.devicesChartOptions = this.makeDevicesChartOptions();
                    // this.installsChartOptions = this.makeInstallsChart();

                    // observer.next(false);
                }
            });
        });
    }

    private loadAnalyticsData() {
        // GET TOTAL USERS
        const totalUsersAnalytics = new GoogleAnalyticRequest(this.googleAnalyticsViewID, '2020-01-01', 'today',
            [new GoogleAnalyticMetric('totalUsers', 'Users')],
            []
        );
        this.googleAnalyticsService.getGoogleAnalyticReports(totalUsersAnalytics).subscribe(
            result => {
                this.totalInstall.next(result.original?.result?.rows[0]?.metricValues[0]?.value);
            }
        );
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // GET TODAY INSTALL
        const todayInstallAnalytics = new GoogleAnalyticRequest(
            this.googleAnalyticsViewID, 'today', 'today',
            [new GoogleAnalyticMetric('newUsers', 'Users')],
            []
        );
        this.googleAnalyticsService.getGoogleAnalyticReports(todayInstallAnalytics).subscribe(
            result => {
                this.todayInstall.next(result.original?.result?.rows[0]?.metricValues[0]?.value);
            }
        );
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // GET Last 30 Days INSTALL
        const last30DaysInstallAnalytics = new GoogleAnalyticRequest(
            this.googleAnalyticsViewID, '30daysAgo', 'today',
            [new GoogleAnalyticMetric('newUsers', 'Users')],
            [new GoogleAnalyticDimension('date')]
        );
        this.googleAnalyticsService.getGoogleAnalyticReports(last30DaysInstallAnalytics).subscribe(
            result => {
                const xAxisValues = [];
                const yAxisValues = [];
                result.original?.result?.rows.forEach(item => {
                    const value = item?.dimensionValues[0]?.value;
                    if (value) {
                        const dateString = value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2);
                        const myDate = new Date(dateString);
                        const formattedDate = formatDate(myDate, 'MMM d', 'en-US');
                        xAxisValues.push(formattedDate);
                        yAxisValues.push(parseInt(item.metricValues[0].value, 10));
                    }
                });
                this.installsChartOptions = this.getAreaChartOption([new ArealChartSeries('Installs', yAxisValues)], xAxisValues);
                this.installsChart.labels = xAxisValues;
                this.installsChart.updateSeries([new ArealChartSeries('Installs', yAxisValues)]);
                this.installsChart.render().then();

            }
        );
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // GET Last 30 Days Device Categories
        const last30DaysCategoryAnalytics = new GoogleAnalyticRequest(
            this.googleAnalyticsViewID, '2020-01-01', 'today',
            [new GoogleAnalyticMetric('totalUsers', 'Users')],
            [new GoogleAnalyticDimension('platform')]
        );
        this.googleAnalyticsService.getGoogleAnalyticReports(last30DaysCategoryAnalytics).subscribe(
            result => {
                const dataLabels = [];
                const dataValues = [];
                result.original?.result?.rows.forEach(item => {
                    dataLabels.push(item.dimensionValues[0].value);
                    dataValues.push(parseInt(item.metricValues[0].value, 10));
                });
                this.devicesChartOptions = this.getRadialDonutChartOption(dataValues, dataLabels);
                this.devicesChart.labels = dataLabels;
                this.devicesChart.updateSeries(dataValues);
                this.devicesChart.render().then();
            }
        );
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // GET Last 30 Days Popular Pages
        const last30DaysPopularityAnalytics = new GoogleAnalyticRequest(
            this.googleAnalyticsViewID, '2020-01-01', 'today',
            [new GoogleAnalyticMetric('screenPageViews', 'Users')],
            [new GoogleAnalyticDimension('unifiedPageScreen')]
        );
        this.googleAnalyticsService.getGoogleAnalyticReports(last30DaysPopularityAnalytics).subscribe(
            result => {
                const dataLabels = [];
                const dataValues = [];
                result.original?.result?.rows.forEach(item => {
                    dataLabels.push(item.dimensionValues[0].value);
                    dataValues.push(parseInt(item.metricValues[0].value, 10));
                });
                this.pagePopularityChartOptions = this.getRadialDonutChartOption(dataValues, dataLabels, 500);
                this.pagePopularityChart.labels = dataLabels;
                this.pagePopularityChart.updateSeries(dataValues);
                this.pagePopularityChart.render().then();
            }
        );
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    /**
     * make devices chart data
     * @returns chart data
     */
    makeDevicesChartOptions() {
        return {
            series: [{
                name: 'My-series',
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }],
            chart: {
                width: 340,
                type: 'pie'
            },
            labels: [],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ]
        };
    }

    getRadialDonutChartOption(dataValues: number[], dataLabels: string[], _width: number = 340) {
        return {
            series: dataValues,
            labels: dataLabels,
            chart: {
                width: _width,
                type: 'donut'
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        }
                    }
                }
            ]
        };
    }

    /**
     * make size chart data
     * @returns chart data
     */
    getRadialBarChartOption(barValue: number = 0) {
        return {
            series: [barValue],
            chart: {
                height: 250,
                type: 'radialBar'
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '65%',
                    },
                    dataLabels: {
                        showOn: 'always',
                        name: {
                            show: false,
                            fontWeight: '700',
                        },
                        value: {
                            fontSize: '30px',
                            fontWeight: '700',
                            offsetY: 12,
                            show: true,
                        },
                    }
                }
            }
        };
    }


    makeInstallsChart() {
        return {
            series: [
                {
                    name: 'TEST',
                    data: [],
                }
            ],
            chart: {
                type: 'area',
                height: 350,
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },

            // labels: this.dashboard.installations.X,
            xaxis: {
                type: 'category'
            },
            yaxis: {
                opposite: true
            },
            legend: {
                horizontalAlign: 'left',

            }
        };
    }

    getAreaChartOption(seriesData: ArealChartSeries[], dataLabel: string[]) {
        return {
            series: seriesData,
            labels: dataLabel,
            chart: {
                type: 'area',
                height: 350,
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            xaxis: {
                type: 'category',
            },
            yaxis: {
                opposite: false
            },
            legend: {
                horizontalAlign: 'left',

            },
            tooltip: {
                shared: false,
                intersect: true
            },
        };

    }

    getLineChart(xAxisValues: string[], yAxisValues: string[]) {
        return {
            series: [
                {
                    name: '',
                    data: yAxisValues,
                }
            ],
            chart: {
                type: 'area',
                height: 350,
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },

            labels: xAxisValues,
            xaxis: {
                type: 'category'
            },
            yaxis: {
                opposite: true
            },
            legend: {
                horizontalAlign: 'left',

            }
        };
    }

    getPieChart(values: number[], datalabels: string[]) {
        return {
            series: values,
            chart: {
                width: 340,
                type: 'donut'
            },
            labels: datalabels,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ]
        };
    }


}
