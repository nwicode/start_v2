import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-privacy',
  templateUrl: './app-privacy.component.html',
  styleUrls: ['./app-privacy.component.scss']
})
export class AppPrivacyComponent implements OnInit {

  unique_string_id = '';
  privacyText: string = '';

  constructor(private activateRoute: ActivatedRoute, private httpClient: HttpClient, private changeDetectorRef: ChangeDetectorRef, private meta: Meta) {
    this.unique_string_id = activateRoute.snapshot.params['unique_string_id'];
  }

  ngOnInit(): void {
    this.meta.addTag({name: 'robots', content: 'noindex' });
    document.getElementById('kt_body').style.background = 'white';

    this.httpClient.post(environment.apiUrl + 'api/getPublicApplicationPrivacy', {
      unique_string_id: this.unique_string_id
    }).toPromise().then(response => {
      this.privacyText = (<any>response).privacy;
      this.changeDetectorRef.detectChanges();
    });
  }

}
