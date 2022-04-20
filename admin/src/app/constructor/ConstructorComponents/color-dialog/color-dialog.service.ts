import { Injectable } from '@angular/core';
import {ColorDialogComponent} from './color-dialog.component';
import {IonicDialogComponent} from '../ionic-dialog/ionic-dialog.component';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LayoutService} from '../../../services/layout.service';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ColorDialogService {

  page: any;
  page_loaded: boolean = false;

  constructor(private router: Router, private layoutService:LayoutService, private modalService: NgbModal) {  }


  public open(page:any):Promise<any> {
    this.page = page;
    console.log(page);
    let promise = new Promise( (resolve,reject)=>{



      const modalRef = this.modalService.open(ColorDialogComponent, {size: "lg"});
      let applicationId: number;
      applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

      this.layoutService.getApplicationColorsInLayouts(applicationId).then( colors =>{
        console.log(colors);
        modalRef.componentInstance.page_loaded = true;
        modalRef.componentInstance.colors = colors;
      });

      modalRef.result.then((result) => {
        console.log(`User's choice result: ${result}`);
        resolve (result);
      }, (reason)=>{
        console.log(`User's choice reason: ${reason}`);
        resolve(reason);
      })        

    })
    return promise;
  }


  public openIcons(page:any):Promise<any> {
    this.page = page;
    console.log(page);
    let promise = new Promise( (resolve,reject)=>{



      const modalRef = this.modalService.open(IonicDialogComponent, {size: "lg"});
      let applicationId: number;
      applicationId = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

      this.layoutService.getApplicationColorsInLayouts(applicationId).then( colors =>{
        console.log(colors);
        modalRef.componentInstance.page_loaded = true;
        modalRef.componentInstance.colors = colors;
      });

      modalRef.result.then((result) => {
        console.log(`User's choice result: ${result}`);
        resolve (result);
      }, (reason)=>{
        console.log(`User's choice reason: ${reason}`);
        resolve(reason);
      })        

    })
    return promise;
  }


  

}
