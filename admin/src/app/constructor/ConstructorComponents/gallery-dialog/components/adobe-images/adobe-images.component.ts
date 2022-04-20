import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AdobeAccess, AdobeLibrary, AdobeLibraryElement, GalleryDialog} from '../../gallery-dialog.objects';
import {GalleryImagesService} from '../../services/gallery-images.service';
import {environment} from '../../../../../../environments/environment.prod';


@Component({
    selector: 'app-adobe-images',
    templateUrl: './adobe-images.component.html',
    styleUrls: ['./adobe-images.component.scss']
})
export class AdobeImagesComponent implements OnInit {
    public adobeAccess: AdobeAccess = new AdobeAccess('', '', '', '', '');
    public adobeLibraryElements: AdobeLibraryElement[] = [];
    public adobeLibraries: AdobeLibrary[] = [];
    public isLoading = true;
    @Input() galleryDialog: GalleryDialog = new GalleryDialog();
    @Output() onSelectLibraryElements: EventEmitter<AdobeLibraryElement[]> = new EventEmitter<AdobeLibraryElement[]>();
    @Output() onSelectLibraryElement: EventEmitter<AdobeLibraryElement> = new EventEmitter<AdobeLibraryElement>();
    @Output() onCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private galleryImagesService: GalleryImagesService) {

    }

    ngOnInit(): void {
        const adobeCode = localStorage.getItem('adobe_auth_code');
        this.isLoading = true;
        if (adobeCode != null) {
            this.galleryImagesService.getAdobeAccessToken(adobeCode);
            localStorage.removeItem('adobe_auth_code');
        } else {
            const accessToken = localStorage.getItem('adobe_access_token');
            if (accessToken != null) {
                this.adobeAccess = new AdobeAccess(accessToken, '', '', '', '');
                localStorage.setItem('adobe_access_token', this.adobeAccess.accessToken);
                this.galleryImagesService.getAdobeLibraries(this.adobeAccess.accessToken);
            } else {
                this.isLoading = false;
            }
        }
        this.galleryImagesService.AdobeAccess.subscribe(
            data => {
                this.adobeAccess = data;
                localStorage.setItem('adobe_access_token', this.adobeAccess.accessToken);
                this.galleryImagesService.getAdobeLibraries(this.adobeAccess.accessToken);
            }, error => {
                const accessToken = localStorage.getItem('adobe_access_token');
                if (accessToken != null) {
                    this.adobeAccess = new AdobeAccess(accessToken, '', '', '', '');
                    ;
                    localStorage.setItem('adobe_access_token', this.adobeAccess.accessToken);
                    this.galleryImagesService.getAdobeLibraries(this.adobeAccess.accessToken);
                }
            }
        );
        this.galleryImagesService.AdobeLibraries.subscribe(
            data => {
                this.adobeLibraries = data;
                this.isLoading = false;
            }
        );
        this.galleryImagesService.AdobeLibraryElements.subscribe(data => {
            this.adobeLibraryElements = data;
            this.isLoading = false;
        });
    }

    selectImage(adobeElement: AdobeLibraryElement) {
        adobeElement.isSelected = !adobeElement.isSelected;
    }

    selectImages() {
        if (this.galleryDialog.selectMultiple) {
            if (this.getSelectedElements().length > 0) {
                this.onSelectLibraryElements.emit(this.getSelectedElements());
            }
        } else {
            if (this.getSelectedElements().length > 0) {
                this.onSelectLibraryElements.emit(this.getSelectedElements()[0]);
            }
        }
    }

    getSelectedElements() {
        const images = [];
        this.adobeLibraryElements.forEach(item => {
            if (item.isSelected) {
                images.push(item);
            }
        });
        return images;
    }

    cancel() {
        this.onCanceled.emit(true);
    }

    onLibraryChanged(selectedLibrary) {
        this.isLoading = true;
        this.galleryImagesService.getAdobeLibraryElements(new AdobeLibrary('', selectedLibrary.value), this.adobeAccess.accessToken);
    }

    connectAdobe() {
        localStorage.setItem('redirect_url', '/tarifs/tarif-list');
        const scope = 'openid,creative_sdk,profile,address,AdobeID,email,cc_files,cc_libraries';
        const test = 'https://ims-na1.adobelogin.com/ims/authorize?client_id=' + environment.adobeClientId + '&scope=' + scope + '&response_type=code&redirect_uri=dd';
        window.location.assign(test);
    }

    public getAdobeImageUrl(adobeElement: AdobeLibraryElement) {
        return environment.apiUrl + 'api/gallery_images/image_base64?access_token=' + this.adobeAccess.accessToken
            + '&thumbnail_url=' + adobeElement.thumbnail;
    }
}

