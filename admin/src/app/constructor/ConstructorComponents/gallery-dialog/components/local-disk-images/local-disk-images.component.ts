import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GalleryDialog, GalleryImage} from '../../gallery-dialog.objects';
import {GalleryImagesService} from '../../services/gallery-images.service';
import {LocalDiskImage} from './local-disk-images.objects';
import {HttpEventType} from '@angular/common/http';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-local-disk-images',
    templateUrl: './local-disk-images.component.html',
    styleUrls: ['./local-disk-images.component.scss']
})
export class LocalDiskImagesComponent implements OnInit {
    public isLoading = false;
    public myImages: LocalDiskImage[] = [];
    public mode: ProgressSpinnerMode = 'determinate';
    @Input() galleryDialog: GalleryDialog = new GalleryDialog();
    @Output() onSelectGalleryImages: EventEmitter<LocalDiskImage[]> = new EventEmitter<LocalDiskImage[]>();
    @Output() onSelectGalleryImage: EventEmitter<LocalDiskImage> = new EventEmitter<LocalDiskImage>();
    @Output() onCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('file') file: any;

    constructor(private galleryImagesService: GalleryImagesService) {
    }

    ngOnInit(): void {
    }

    selectImage(myImage: LocalDiskImage) {
        if (myImage.isUploaded) {
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

    public onFileSelected(): void {
        const files: { [key: string]: File } = this.file.nativeElement.files;
        for (const pos in files) {
            if (!isNaN(parseInt(pos, 10))) {
                const diskImage: LocalDiskImage = new LocalDiskImage(files[pos].name, '', true, false);
                diskImage.file = files[pos];
                diskImage.isUploaded = false;
                this.uploadFile(diskImage);
            }
        }
    }

    public selectFile(): void {
        this.file.nativeElement.click();
    }

    uploadFile(diskImage: LocalDiskImage) {
        console.log("this.galleryDialog.uploadDirectory");
        console.log(this.galleryDialog.uploadDirectory);
        this.myImages.push(diskImage);
        this.galleryImagesService.uploadFile(diskImage.file, this.galleryDialog.uploadDirectory).subscribe(
            event => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        console.log('FILE PROGRESS DATA', event);
                        diskImage.progress = Math.round(event.loaded * 100 / event.total);
                        console.log('FILE PROGRESS', diskImage.progress);
                        break;
                    case HttpEventType.Response:
                        console.log('FILE Upload Success!', event.body.result);
                        diskImage.imageUrl = environment.apiUrl + event.body.result.file_url;
                        diskImage.fileName = event.body.result.file_name;
                        diskImage.fileDirectory = event.body.result.directory;
                        diskImage.isUploaded = true;
                }
            }, failed => {
                console.log('FILE Upload FAILED', failed);
            }
        );
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
