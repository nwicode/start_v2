import {GalleryDialog, GalleryImage} from '../../gallery-dialog.objects';

export class LocalDiskImage extends GalleryImage {
    public file: any;
    public fileName: string;
    public fileDirectory: string;
    public progress = 0;
    public isUploaded = false;
}