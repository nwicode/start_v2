import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ApplicationService} from "../../../services/application.service";
import {Router} from "@angular/router";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PushMessageService} from "../../../services/push-message.service";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  isLoading$: Observable<boolean>;

  applicationId: number;
  topics = [];

  constructor(private router: Router, private appService: ApplicationService, private formBuilder: FormBuilder, private translationService: TranslationService, private toastService: ToastService, private pushMessageService: PushMessageService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.pushMessageService.getTopics(this.applicationId).then(response => {
        if (!response.is_error) {
          this.topics = response.topics;
          observer.next(false);

        }
      });
    });
  }

  deleteTopic(topic_id, topic_index) {
    if (topic_id != null) {
      this.isLoading$ = new Observable<boolean>(observer => {
        observer.next(true);
        this.pushMessageService.deleteTopic(this.applicationId,topic_id).then(response => {
          if (!response.is_error) {
            this.pushMessageService.getTopics(this.applicationId).then(response => {
              if (!response.is_error) {
                this.topics = response.topics;
              }
              observer.next(false);
            });
          }
        });
      });
    } else {
      this.topics.splice(topic_index, 1);
    }
  }

  saveTopic(topic_id, topic_index: number) {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.pushMessageService.setTopic(this.applicationId, this.topics[topic_index].name, topic_id ? topic_id : null).then(response => {
        if (!response.is_error) {
          this.pushMessageService.getTopics(this.applicationId).then(response => {
            if (!response.is_error) {
              this.topics = response.topics;
            }
            observer.next(false);
          });
        }
      });
    });
  }

  createTopic() {
    this.topics.push({name: ''});
  }
}
