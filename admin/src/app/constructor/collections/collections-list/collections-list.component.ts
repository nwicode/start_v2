import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslationService} from "../../../services/translation.service";
import {ToastService} from "../../../platform/framework/core/services/toast.service";
import {CollectionService} from "../../../services/collection.service";
import { SubheaderService } from '../../ConstructorComponents/subheader/_services/subheader.service';
import {ApplicationService} from "../../../services/application.service";

@Component({
  selector: 'app-colletctions-list',
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.scss']
})
export class CollectionsListComponent implements OnInit {

  isLoading$: Observable<boolean>;
  applicationId: number;
  app;

  collections = [];

  constructor(private router: Router, private collectionService: CollectionService, private translationService: TranslationService, private subheader: SubheaderService, private toastService: ToastService, private appService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.COLLECTIONS_LIST.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.COLLECTIONS_LIST.TITLE',
        linkText: 'CONSTRUCTOR.COLLECTIONS_LIST.TITLE',
        linkPath: '/constructor/' + this.applicationId + '/collections/collections-list'
      }]);
    }, 1);

    this.isLoading$ = new Observable<boolean>( observer => {
      observer.next(true);

      Promise.all([this.collectionService.getCollectionList(this.applicationId), this.appService.getApplicationById(this.applicationId)]).then(response => {
        this.collections = response[0].collections;

        this.app = response[1];
        observer.next(false);
      });

    });
  }

}
