import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastBar: MatSnackBar) {}

  sendClass:string = '';
  sendMessage:string = '';

  public showsToastBar(message: string, type: string) {
    //console.log("Mesage "+message + " type "+type);
    if(type){
      if(type == 'success') {
        this.sendClass = 'bg-success'
      }else if (type == 'warning') {
        this.sendClass = 'bg-warning'
      }else if(type == 'danger') {
        this.sendClass = 'bg-danger'
      }else if(type == 'info') {
        this.sendClass = 'bg-info'
      }else if(type == 'primary') {
        this.sendClass = 'bg-primary'
      }else if(type == 'secondary') {
        this.sendClass = 'bg-secondary'
      }
    }else {
      this.sendClass =  'bg-radial-gradient-primary'
    }
    console.log("Class Send "+ this.sendClass);
    this.toastBar.open(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: this.sendClass,
    });
  }                                    
}
