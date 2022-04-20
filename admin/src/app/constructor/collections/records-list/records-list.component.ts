import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {CollectionService} from "../../../services/collection.service";
import {TranslationService} from "../../../services/translation.service";
import {SubheaderService} from "../../ConstructorComponents/subheader/_services/subheader.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {ApplicationService} from "../../../services/application.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss']
})
export class RecordsListComponent implements OnInit {

  isLoading$: Observable<boolean>;
  applicationId: number;
  collectionId;

  resources_dir = '';
  platform_url = '';

  app;
  collection;
  records = [];
  fields;

  constructor(private route: ActivatedRoute, private router: Router, private collectionService: CollectionService, private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.collectionId = this.route.snapshot.paramMap.get('collection_id');
    this.platform_url = environment.apiUrl;

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.RECORDS_LIST.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.RECORDS_LIST.TITLE',
        linkText: 'CONSTRUCTOR.RECORDS_LIST.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/collections/records-list/' + this.collectionId
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      Promise.all([this.collectionService.getCollectionRecordsList(this.applicationId, this.collectionId), this.collectionService.getCollection(this.applicationId, this.collectionId), this.applicationService.getApplicationById(this.applicationId)]).then(response => {
        this.records = response[0].records;
        for (let i = 0; i < this.records.length; i++) {
          this.records[i].values = JSON.parse(this.records[i].values);
        }
        this.records = this.records.reverse();

        this.collection = response[1].collection;

        this.app = response[2];
        this.resources_dir = 'storage/application/' + this.app.id + "-" + this.app.unique_string_id + '/resources//';

        this.fields = JSON.parse(this.collection.fields);
        this.fields = this.fields.fields;
        console.log(this.fields);
        console.log(this.app.default_language);

        observer.next(false);
      });

    });
  }

  deleteRecord(id, index) {
    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);
      this.collectionService.deleteCollectionRecord(this.applicationId, id).then(response => {
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
          this.records.splice(index, 1);
        }
        observer.next(false);
      });
    });
  }

}
