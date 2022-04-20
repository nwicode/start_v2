import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";
import {ApplicationService} from "../../services/application.service";
import {HttpClient} from "@angular/common/http";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../platform/framework/core/services/toast.service";
import {TranslationService} from "../../services/translation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PushMessageService} from "../../services/push-message.service";

@Component({
  selector: 'app-push-messages',
  templateUrl: './push-messages.component.html',
  styleUrls: ['./push-messages.component.scss']
})
export class PushMessagesComponent implements OnInit {

  isLoading$: Observable<boolean>;
  isLoadOneSignalSettings = false;

  applicationId: number;
  messages: any[];
  languages: any[] = [];

  isOneSignalOff: boolean = false;
  oneSignalId: string;
  oneSignalApiKey: string;

  isShowAddMessageForm: boolean = false;
  addMessageForm: FormGroup;
  titleControls: FormArray;
  messageControls: FormArray;
  inspectMessage: any;

  pagination_string: string = "";
  currentPage = 1;
  itemsPerPage = 50;
  pagesCount = 0;
  totalMessages = 0;

  constructor(private router: Router, private subheader: SubheaderService, private appService: ApplicationService, private http: HttpClient, private formBuilder: FormBuilder, private translationService: TranslationService, private toastService: ToastService, private modalService: NgbModal, private pushMessageService: PushMessageService) { }

  async ngOnInit(): Promise<void> {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    await this.translationService.readLanguages();
    this.languages = this.translationService.getAvailableLanguages();

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.PUSH_MESSAGES.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.PUSH_MESSAGES.TITLE',
        linkText: 'CONSTRUCTOR.PUSH_MESSAGES.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/push-messages'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.appService.getOneSignalSettings(this.applicationId).then(response => {
        if (!response.is_error) {
          this.isOneSignalOff = !response.one_signal_enabled;
          this.oneSignalId = response.one_signal_id;
          this.oneSignalApiKey = response.one_signal_api_key;
          this.isLoadOneSignalSettings = true;

          if (!this.isOneSignalOff) {
            this.pushMessageService.getPushMessagesList(this.applicationId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).then(response => {
              this.messages = response.messages;
              this.totalMessages = response.total_count;
              this.pagesCount = Math.ceil(this.totalMessages / this.itemsPerPage);

              observer.next(false);
            });
          } else {
            observer.next(false);
          }
        }
      });
    });
  }

  initAddMessageForm() {
    this.titleControls = new FormArray([]);
    this.messageControls = new FormArray([]);

    this.addMessageForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      largeText: new FormControl(''),
      sendAfter: new FormControl(0),
      sendAfterTime: new FormControl(0),
      image: new FormControl('')
    });
  }

  /**
   * Create new push message.
   */
  createPush() {
    let messageInformation = {
      app_id: this.oneSignalId,
      headings: {en: this.addMessageForm.get('title').value},
      included_segments: ["Subscribed Users"],
      contents: {en: this.addMessageForm.get('message').value}
    };

    if (this.addMessageForm.get('image').value) {
      messageInformation['large_icon'] = this.addMessageForm.get('image').value;
    }

    if (this.addMessageForm.get('sendAfter').value) {
      const date = new Date(this.addMessageForm.get('sendAfterTime').value);
      messageInformation['send_after'] = date.toUTCString();
    }

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.pushMessageService.createNotificationWithSaveInOurDataBase(this.oneSignalApiKey, messageInformation, this.applicationId, this.addMessageForm.get('largeText').value).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');

          this.pushMessageService.getPushMessagesList(this.applicationId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).then(response => {
            this.messages = response.messages;
            this.totalMessages = response.total_count;
            this.pagesCount = Math.ceil(this.totalMessages / this.itemsPerPage);

            this.isShowAddMessageForm = false;
            observer.next(false);
          });
        }
      });
    });
  }

  /**
   * Load push messages list.
   */
  loadPushHistory() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.pushMessageService.getPushMessagesList(this.applicationId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).then(response => {
        if (!response.is_error) {
          this.messages = response.messages;
          this.totalMessages = response.total_count;
          this.pagesCount = Math.ceil(this.totalMessages / this.itemsPerPage);
        }

        observer.next(false);
      });
    });
  }

  /**
   * Show pagination string
   */
  paginationString() {
    this.pagination_string = this.translationService.translatePhrase("GENERAL.LANGUAGES.PAGINATION");
    this.pagination_string = this.pagination_string.replace("%total", this.pagesCount.toString());
    this.pagination_string = this.pagination_string.replace("%page", this.currentPage.toString());
    return this.pagination_string;
  }

  /**
   * Change page event.
   *
   * @param event page change event
   */
  pageChange(event: string) {
    this.currentPage = parseInt(event);
    this.loadPushHistory();
  }

  /**
   * Open modal window with message information.
   *
   * @param message message object
   * @param content template
   */
  openMessageDetails(message: any, content: any) {
    this.inspectMessage = message;
    this.modalService.open(content, {size: 'lg', scrollable: true}).result.then((result) => {
      if (result === 'cancel') {
        this.inspectMessage = null;
      }
    });
  }
}
