import {Injectable, EventEmitter} from '@angular/core';
import {RequestsService} from './requests.service';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {AdobeAccess, AdobeLibrary, AdobeLibraryElement, GalleryImage} from '../gallery-dialog.objects';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GalleryImagesService {
    public dataFound = new EventEmitter<string>();
    public AdobeAccess = new EventEmitter<AdobeAccess>();
    public GalleryImages = new EventEmitter<GalleryImage[]>();
    public AdobeLibraries = new EventEmitter<AdobeLibrary[]>();
    public AdobeLibraryElements = new EventEmitter<AdobeLibraryElement[]>();

    constructor(private requestService: RequestsService) {
    }

    public getGalleryImagesFromDirectory(fileDirectory: string): void {
        const params = new HttpParams().set('file_directory', fileDirectory);
        this.requestService.sendGetRequest('gallery_images/from_file', '', params).subscribe(
            data => {
                this.GalleryImages.emit(data.result.map(item => new GalleryImage(item.file_name, item.file_path, item.is_file,
                    item.is_parent)));
            }
        );
    }

    public getAdobeAccessToken(accessToken: string) {
        const params = new HttpParams().set('code', accessToken);
        this.requestService.sendGetRequest('adobe_cc/get_access_token', '', params).subscribe(
            data => {
                this.AdobeAccess.emit(new AdobeAccess(data.result.access_token, data.result.sub, data.result.id_token,
                    data.result.token_type, data.result.expires_in));
            }
        );
    }

    public getAdobeLibraries(accessToken: string) {
        const params = new HttpParams().set('access_token', accessToken);
        this.requestService.sendGetRequest('gallery_images/adobe_libraries', '', params).subscribe(
            data => {
                this.AdobeLibraries.emit(data.result.map(item => new AdobeLibrary(item.id, item.name, item.ownership,
                    item.library_urn, item.elements_count, item.assetSubType, item.rawName, item.parent_assetId)));
            }
        );
    }

    public getAdobeLibraryElements(library: AdobeLibrary, accessToken) {
        const params = new HttpParams().set('library_name', library.name).set('access_token', accessToken);
        this.requestService.sendGetRequest('gallery_images/adobe_library_elements', '', params).subscribe(
            data => {
                this.AdobeLibraryElements.emit(data.result.map(item => new AdobeLibraryElement(item.id, item.name, item.type,
                    item.thumbnail.rendition, item.assetSubType)));
            }
        );
    }

    public getAdobeLibraryElementImageBase64(accessToken: string, adobeElement: AdobeLibraryElement) {
        const params = new HttpParams().set('access_token', accessToken).set('thumbnail_url', adobeElement.thumbnail);
        return this.requestService.sendGetRequest('gallery_images/image_base64', '', params);
    }

    public uploadFile(uploadFile: any, directoryName: string): Observable<any> {
        const header = new HttpHeaders().set('GALLERY_UPLOAD', 'GALLERY_UPLOAD');
        const formData: FormData = new FormData();
        formData.append('file', uploadFile);
        formData.append('file_directory', directoryName);
        return this.requestService.sendPostRequest('gallery_images/upload_file', formData, 'TEST', header);
    }

    public onDataFound(data: string) {
        this.dataFound.emit(data);
    }

    public getAuth() {
        const params = new HttpParams()
            .set('redirect_uri', 'scope')
            .set('response_type', 'scope')
            .set('scope', 'scope')
            .set('client_id', '1f1fafb3ad294fbf9f164eba75f13a5d');
        this.requestService.sendCustomGetRequest('https://ims-na1.adobelogin.com/ims/authorize?', new HttpHeaders(), params);
    }
}
