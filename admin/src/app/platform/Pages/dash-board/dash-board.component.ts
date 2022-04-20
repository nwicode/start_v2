import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis
} from "ng-apexcharts";

import {SubheaderService} from "../../LayoutsComponents/subheader/_services/subheader.service";
import {SettingsService} from "../../../services/settings.service";
import {TranslationService} from "../../../services/translation.service";
import {fromEvent, interval, Observable, Subject, Subscription} from "rxjs";
import {LicenseService} from "../../../services/license.service";
import {ConfigService} from "../../../services/config.service";
import { SdkService } from '../../../services/sdk.service';

export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit, OnDestroy {



  isLoading$ = new Subject<boolean>();
  page_loaded: boolean = false;
  sdk_errors: boolean = false;
  dashboard: any = {};

  has_new_version = false;
  version = '';
  checkVersionSub: Subscription;

  @ViewChild("kt_mixed_widget_14_chart") chart: ChartComponent;

  public chartOptions1: Partial<ChartOptions1>;
  
  constructor(private sdk:SdkService, private translationService:TranslationService, private settingsService: SettingsService, private subheader: SubheaderService, public licenseService: LicenseService, private changeDetectorRef: ChangeDetectorRef, private configService: ConfigService) { }


  

  ngOnInit(): void {
    setTimeout(() => {
      this.subheader.setTitle('DASHBOARD.DASHBOARD_TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'DASHBOARD.DASHBOARD_TITLE',
        linkText: '',
        linkPath: ''
      }]);
    }, 1);

    this.configService.getConfig().then(config => {
      if ((<any>config).last_check_date) {
        let check_date: any= new Date((<any>config).last_check_date);
        if ((Date.now() - check_date) > 60 * 60 * 1000) {
          this.licenseService.checkUpdates().then(async response => {
            this.has_new_version = response.status;
            if (response.status) {
              this.version = response.version;
            }
            this.changeDetectorRef.detectChanges();
          });
        }
      }
    });


    this.checkVersionSub = interval(60 * 60 * 1000).subscribe(()=>{
      this.licenseService.checkUpdates().then(async response => {
        this.has_new_version = response.status;
        if (response.status) {
          this.version = response.version;
        }
        this.changeDetectorRef.detectChanges();
      });
    });

    this.isLoading$.next(true);
    this.settingsService.getAdminDashboard().then ( data => {
      //this.isLoading$.next(false);
      this.dashboard = data;
      this.setRegistrationChartData();
      this.sdk.checkSDK().then (check_result=>{
        console.log("check_result");
        console.log(check_result);
        this.sdk_errors = check_result.errors;
        this.page_loaded = true;
        this.isLoading$.next(false);
      })
      //this.page_loaded = true;
    }).catch (err=>{
      console.log("get dashboard error:");
      console.log(err)
    })
    
  }


  setRegistrationChartData() {
    this.chartOptions1 = {
      series: [
        {
          name: this.translationService.translatePhrase("DASHBOARD.REGISTRATIONS"),
          type: "column",
          data: this.dashboard.users_registrations_qty
        },
        {
          name: this.translationService.translatePhrase("DASHBOARD.PAYMENTS"),
          type: "line",

          data: this.dashboard.users_registrations_money
        },

      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      stroke: {
        width: [1, 4]
      },
      title: {
        text: this.translationService.translatePhrase("DASHBOARD.REGISTRATIONS_30_DAYS"),
        align: "left",
        offsetX: 110
      },
      xaxis: {
        categories: this.dashboard.users_registrations_dates
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#008FFB"
          },

          title: {
            text: this.translationService.translatePhrase("DASHBOARD.REGISTRATIONS"),
            style: {
              color: "#008FFB"
            }
          },
          tooltip: {
            enabled: true
          }
        }
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40
      }
    };
  }

  ngOnDestroy() {
    this.checkVersionSub.unsubscribe();
  }
}
