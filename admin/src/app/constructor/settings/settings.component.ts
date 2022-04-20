import { Component, OnInit } from '@angular/core';
import {SubheaderService} from "../ConstructorComponents/subheader/_services/subheader.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private subheader: SubheaderService) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.SETTINGS.TITLE');
      this.subheader.setBreadcrumbs([{
        title: 'CONSTRUCTOR.SETTINGS.TITLE',
        linkText: 'CONSTRUCTOR.SETTINGS.TITLE',
        linkPath: '/settings'
      }]);
    }, 1);

  }

}
