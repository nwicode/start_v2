import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {ToastService} from '../../framework/core/services/toast.service';
import { SubheaderService } from '../../LayoutsComponents/subheader/_services/subheader.service';
import { TranslationService } from '../../../services/translation.service';
import { ContentService } from '../../../services/content.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-settings-assets',
  templateUrl: './settings-assets.component.html',
  styleUrls: ['./settings-assets.component.scss']
})
export class SettingsAssetsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private contentService: ContentService, private translationService: TranslationService, private subheader: SubheaderService,private toastService: ToastService, private fb: FormBuilder,) { }

  ngOnInit(): void {

  }

}
