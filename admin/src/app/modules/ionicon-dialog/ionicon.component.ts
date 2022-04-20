import {Component, Inject, OnInit} from '@angular/core';
import {Ionicons} from './ionicon-dialog.objects';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GalleryDialog} from '../gallery-dialog/gallery-dialog.objects';

@Component({
    selector: 'app-ionicon',
    templateUrl: './ionicon.component.html',
    styleUrls: ['./ionicon.component.scss']
})
export class IoniconComponent implements OnInit {
    public myIonicons = [];
    public searchText = '';
    public selectedIcon = '';

    constructor(public dialogRef: MatDialogRef<IoniconComponent>, @Inject(MAT_DIALOG_DATA) galleryDialog: GalleryDialog) {

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

    submit() {
        if (this.selectedIcon !== '') {
            this.dialogRef.close(this.selectedIcon);
        }
    }

    cancel() {
        this.dialogRef.close();
    }

}
