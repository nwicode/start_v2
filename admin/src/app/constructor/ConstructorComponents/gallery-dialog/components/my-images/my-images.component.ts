import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GalleryDialog, GalleryImage} from '../../gallery-dialog.objects';
import {GalleryImagesService} from '../../services/gallery-images.service';

@Component({
    selector: 'app-my-images',
    templateUrl: './my-images.component.html',
    styleUrls: ['./my-images.component.scss']
})
export class MyImagesComponent implements OnInit {
    public myImages: GalleryImage[] = [];
    public isLoading = true;
    @Input() galleryDialog: GalleryDialog = new GalleryDialog();
    @Output() onSelectGalleryImages: EventEmitter<GalleryImage[]> = new EventEmitter<GalleryImage[]>();
    @Output() onSelectGalleryImage: EventEmitter<GalleryImage> = new EventEmitter<GalleryImage>();
    @Output() onCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private galleryImagesService: GalleryImagesService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.galleryImagesService.getGalleryImagesFromDirectory(this.galleryDialog.imageSrc);
        this.galleryImagesService.GalleryImages.subscribe(data => {
            this.myImages = data;
            this.isLoading = false;
        });
    }

    selectImage(myImage: GalleryImage) {
        if (!myImage.isFile) {
            if (myImage.isParent) {
                this.isLoading = true;
                console.log('selectImage ->', this.galleryDialog.imageSrc);
                if (this.galleryDialog.imageSrc.lastIndexOf('/') > 0) {
                    this.galleryDialog.imageSrc = this.galleryDialog.imageSrc.substr(0, this.galleryDialog.imageSrc.lastIndexOf('/'));
                    this.galleryImagesService.getGalleryImagesFromDirectory(this.galleryDialog.imageSrc);
                }
                console.log('selectImage -> ', this.galleryDialog.imageSrc);
            } else {
                this.isLoading = true;
                this.galleryDialog.imageSrc = this.galleryDialog.imageSrc + '/' + myImage.title;
                this.galleryImagesService.getGalleryImagesFromDirectory(this.galleryDialog.imageSrc);
            }

        } else {
            if (!this.galleryDialog.selectMultiple) {
                this.myImages.forEach(image => {
                    image.isSelected = false;
                });
            }
            myImage.isSelected = !myImage.isSelected;
        }
    }

    getSelectedImages() {
        const images = [];
        this.myImages.forEach(image => {
            if (image.isSelected) {
                images.push(image);
            }
        });
        return images;
    }

    selectImages() {
        if (this.galleryDialog.selectMultiple) {
            if (this.getSelectedImages().length > 0) {
                this.onSelectGalleryImages.emit(this.getSelectedImages());
            }
        } else {
            if (this.getSelectedImages().length > 0) {
                this.onSelectGalleryImage.emit(this.getSelectedImages()[0]);
            }
        }
    }

    cancel() {
        this.onCanceled.emit(true);
    }

}
