import { Component, NgModule, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {TranslationService} from '../../../services/translation.service';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LayoutService} from '../../../services/layout.service';
import { Router } from '@angular/router';

@Component({
  
  selector: 'app-color-dialog',
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./color-dialog.component.scss']
})
export class ColorDialogComponent implements OnInit {

  title: string = "";
  page_loaded: boolean = false;
  picker_open: boolean = false;
  saving_process: boolean = false;
  colors: any;
  selected_color: any;
  selected_color_full: any;

  public new_color_name:string = "";
  public new_color_value:string = "";
  public inputText: any;
  applicationId:any;

  constructor(private router: Router, private layoutService:LayoutService,  private modalService: NgbModal, private translate:TranslationService) { }

  ngOnInit(): void {
    this.applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    this.title = this.translate.translatePhrase('CONSTRUCTOR.COLOR_DIALOG.TITLE');
  }

  select() {
    this.modalService.dismissAll(this.selected_color_full);
  }

  setBackgroundColor(i:any) {
    console.log(i);
    this.selected_color = i.color_name;
    this.selected_color_full = i;
  }

  close () {
    this.modalService.dismissAll({});
  }

  openColorPicker() {
    this.picker_open = true;
  }


  /**
   * Close color picker dialog and add color to user colors
   */
   closeAndSaveColorPickerModal() {
    this.saving_process = true;
    let color_id = (Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000).toString();
    let new_color = Object.assign({}, this.colors.colors_system[0]);
    new_color.name = this.new_color_name;
    new_color.color_value = this.new_color_value;
    new_color.color_name = "--ion-color-background"+color_id;
    new_color.new = true;
    new_color.color_type = "user";
    new_color.named = "background"+color_id; //named required
    new_color.disabled = false;
    new_color.letter = "";
    new_color.id = 0;
    this.colors.colors_user.push(new_color);
    this.layoutService.setApplicationColorsInLayouts(this.applicationId, this.colors).then (res=>{
      this.colors = res;
      this.setBackgroundColor(new_color);
      this.saving_process = false;      
      this.picker_open = false;
    });

  }



  /**
   * event on change color in colorpicker
   * @param ev event from image color picker
   */
   changeBgColorEvent(ev:any) {
    this.new_color_value = ev.hex;
  }  


  saveNewColor() {

  }
}
