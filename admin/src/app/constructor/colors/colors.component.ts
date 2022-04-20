import { Component, OnInit } from '@angular/core';

import { SubheaderService } from '../ConstructorComponents/subheader/_services/subheader.service';
import {ToastService} from '../../platform/framework/core/services/toast.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  constructor(private subheader: SubheaderService,private toastService: ToastService,) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.COLORS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.COLORS.TITLE',
        linkText: 'CONSTRUCTOR.COLORS.TITLE',
        linkPath: '/currency'
      }]);
    }, 1);

  }

}
