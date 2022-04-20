import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ContentDialogComponent} from "./content-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class ContentDialogService {
  page: any;

  constructor(private router: Router, private modalService: NgbModal) { }

  public open(page:any):Promise<any> {
    this.page = page;

    let promise = new Promise( (resolve, reject) => {
      const modalRef = this.modalService.open(ContentDialogComponent, {size: "lg"});
      let applicationId: number = Number(this.router.url.match(/constructor\/(\d+)/)[1]);

      modalRef.result.then((result) => {
        console.log(`User's choice result: ${result}`);
        resolve (result);
      }, (reason) => {
        console.log(`User's choice reason: ${reason}`);
        resolve(reason);
      });
    });

    return promise;
  }
}
