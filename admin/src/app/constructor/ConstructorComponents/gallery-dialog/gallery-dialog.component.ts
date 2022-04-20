import {Component, Inject, OnInit} from '@angular/core';
import {GalleryDialog} from './gallery-dialog.objects';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-gallery-dialog',
    templateUrl: './gallery-dialog.component.html',
    styleUrls: ['./gallery-dialog.component.scss']
})
export class GalleryDialogComponent implements OnInit {
    public galleryDialog: GalleryDialog = new GalleryDialog();
    public tabIndex = 0;

    constructor(public dialogRef: MatDialogRef<GalleryDialogComponent>, @Inject(MAT_DIALOG_DATA) galleryDialog: GalleryDialog) {
        this.galleryDialog = galleryDialog;
    }

    ngOnInit(): void {
        const selectedTab = localStorage.getItem('selected_gallery_dialog_tab');
        if (selectedTab != null && parseInt(selectedTab, 10) >= 0) {
            this.tabIndex = parseInt(selectedTab, 10);
        }
    }

    onSelectGalleryImages(images) {
        this.dialogRef.close(images);
    }

    onSelectGalleryImage(image) {
        this.dialogRef.close(image);
    }

    onCanceled(data) {
        console.log(data);
        this.dialogRef.close();
    }

    onSelectedTabChanges(data) {
        localStorage.setItem('selected_gallery_dialog_tab', data);
    }

}
