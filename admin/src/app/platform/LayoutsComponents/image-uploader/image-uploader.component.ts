import { Component, OnInit } from '@angular/core';
import { Output, Input, EventEmitter } from '@angular/core';
import {NgbModal, NgbModalRef,} from '@ng-bootstrap/ng-bootstrap';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {


  @Input() imageSrc:string = '';
  @Input() placeholderSrc:string = '';
  @Input() outWidth:string = '150';
  @Input() outHeight:string = '150';
  @Input() innerWidth:string = '120';
  @Input() innerHeight:string = '120';
  @Input() bgColor:string = '#ffffff';
  @Output() onChange = new EventEmitter();
  @Output() onReset = new EventEmitter();

  _outWidth:number = 0;
  _outHeight:number = 0;

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  aspectRatio = " 1/ 1";
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  my_id : any;
  imageChangedEvent: any = '';
  croppedImage: any = './assets/media/users/blank.png';


  modal:NgbModalRef;

  constructor(private modalService: NgbModal ) { }

  ngOnInit(): void {
    this._outHeight = parseInt(this.outHeight);
    this._outWidth = parseInt(this.outWidth);
    if (this._outHeight == this._outWidth) this.aspectRatio = "1"; 
    else this.aspectRatio = (this._outWidth / this._outHeight).toString();

    if (!this.imageSrc) this.imageSrc = "";
    if (!this.placeholderSrc) this.croppedImage = "";

  }

  removeavatar() {
    this.onReset.emit('reset');
  }


  open(content) {
    this.modal = this.modalService.open(content, {
        size: 'lg'
    });
  }

  fileChangeEvent(event: any, content): void {
    this.imageChangedEvent = event;
    this.open(content);
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      //this.user.avatar = event.base64;
      //console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
      this.showCropper = true;
      console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
      //console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
      console.log('Load failed');
  }

  rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
  }

  rotateRight() {
      this.canvasRotation++;
      this.flipAfterRotate();
  }

  private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH
      };
  }


  flipHorizontal() {
      this.transform = {
          ...this.transform,
          flipH: !this.transform.flipH
      };
  }

  flipVertical() {
      this.transform = {
          ...this.transform,
          flipV: !this.transform.flipV
      };
  }

  resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
  }

  zoomOut() {
      this.scale -= .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  zoomIn() {
      this.scale += .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  toggleContainWithinAspectRatio() {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
      this.transform = {
          ...this.transform,
          rotate: this.rotation
      };
  }  


  gcd(a, b) {
    if (b > a) {
      let temp = a;
      a = b;
      b = temp
    }
    while (b != 0) {
      let m = a % b;
      a = b;
      b = m;
    }
    return a;
  }
  
  /* ratio is to get the gcd and divide each component by the gcd, then return a string with the typical colon-separated value */
  ratio(x:number, y:number) {
    let c = this.gcd(x, y);
    return "" + (x / c) + " / " + (y / c)
  }
  
  cancel() {
    this.modal.close();
  }
  
  store() {
    this.onChange.emit(this.croppedImage);
    this.modal.close();
  }

}
