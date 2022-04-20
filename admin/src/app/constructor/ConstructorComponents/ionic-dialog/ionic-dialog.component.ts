import {Component, Inject, OnInit} from '@angular/core';
import {Ionicons} from './ionicon-dialog.objects';
import {GalleryDialog} from '../gallery-dialog/gallery-dialog.objects';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {TranslationService} from '../../../services/translation.service';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LayoutService} from '../../../services/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ionic-dialog',
  templateUrl: './ionic-dialog.component.html',
  styleUrls: ['./ionic-dialog.component.scss']
})
export class IonicDialogComponent implements OnInit {

  public myIonicons = [];
  public searchText = '';
  public selectedIcon = '';
  page_loaded: boolean = true;

  constructor(private router: Router, private layoutService:LayoutService,  private modalService: NgbModal, private translate:TranslationService) {

  }

  ngOnInit(): void {
      this.myIonicons = new Ionicons().icons;
  }

  selectIcon(iconName: string) {
      if (this.selectedIcon === iconName) {
          this.selectedIcon = '';
      } else {
          this.selectedIcon = iconName;
      }
  }


  close() {
    this.modalService.dismissAll(''); 
  }

  select() {
    this.modalService.dismissAll(this.selectedIcon);
  }

}
