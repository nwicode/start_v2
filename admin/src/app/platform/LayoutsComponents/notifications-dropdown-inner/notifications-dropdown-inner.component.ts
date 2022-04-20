import { Component, OnInit } from '@angular/core';
import {NotificationsService} from '../../../services/notifications.service';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-notifications-dropdown-inner',
  templateUrl: './notifications-dropdown-inner.component.html',
  styleUrls: ['./notifications-dropdown-inner.component.scss'],
})
export class NotificationsDropdownInnerComponent implements OnInit {
  extrasNotificationsDropdownStyle: 'light' | 'dark' = 'dark';
  activeTabId:
    | 'topbar_notifications_notifications'
    | 'topbar_notifications_events'
    | 'topbar_notifications_logs' = 'topbar_notifications_notifications';

  updateNotifications: Subscription;
  newsNotifications:any;
  alertsNotifications:any;
  logsNotifications:any;
  eventsNotifications:any;
  is_newNotifyByType: any = {
    isAlerts: false,
    isEvents: false,
    isLogs: false
  };
  constructor( public notificationsService: NotificationsService ) {

  this.updateNotifications = this.notificationsService.getNotifications().subscribe(data => {
      this.newsNotifications = data.result.NEW.length;
      this.alertsNotifications = data.result.ALERT;
      this.eventsNotifications = data.result.EVENT;
      this.logsNotifications = data.result.LOG;
      if(this.alertsNotifications.length){
        this.is_newNotifyByType.isAlerts = true;
      }else{
        this.is_newNotifyByType.isAlerts = false;
      }
      if(this.eventsNotifications.length){
        this.is_newNotifyByType.isEvents = true;
      }else{
        this.is_newNotifyByType.isEvents = false;
      }
      if(this.logsNotifications.length){
        this.is_newNotifyByType.isLogs = true;
      }else{
        this.is_newNotifyByType.isLogs = false;
      };
      console.log("Вывод is в компоненте: isAlerts", this.is_newNotifyByType.isAlerts);
      console.log("Вывод is в компоненте: isEvents", this.is_newNotifyByType.isEvents);
      console.log("Вывод is в компоненте: isLogs", this.is_newNotifyByType.isLogs);
    });
  }


  ngOnInit(): void {

    //this.getAllNotifications();
  }


  // getAllNotifications() {
  //   this.notificationsService.getNotifications().subscribe(data => {
  //     this.notifications = data;
  //     console.log("Вывод ALERT ов: ", JSON.stringify( this.notifications));
  //   })
  // }

  setActiveTabId(tabId) {
    this.activeTabId = tabId;
  }

  getActiveCSSClasses(tabId) {
    if (tabId !== this.activeTabId) {
      return '';
    }
    return 'active show';
  }
}
