import {environment} from '../../../../environments/environment';

export class GalleryDialog {
    public imageSrc: string;
    public selectMultiple: boolean;
    public fileTypes: string;
    public uploadDirectory: string;

    constructor(imageSrc: string = '', selectMultiple: boolean = false, fileTypes = '.png,.jpg, .csv, .ico', uploadDirectory = 'files') {
        this.imageSrc = imageSrc;
        this.selectMultiple = selectMultiple;
        this.fileTypes = fileTypes;
        this.uploadDirectory = uploadDirectory;
    }
}

export class GalleryImage {
    public title: string;
    public imageUrl: string;
    public fileName: string;
    public isSelected: boolean;
    public isFile: boolean;
    public isParent: boolean;

    constructor(title: string = '', imageUrl: string = '', isFile: boolean, isParent: boolean, fileName:string = "") {
        this.title = title;
        this.imageUrl = environment.apiUrl + imageUrl;
        this.fileName = title;
        this.isSelected = false;
        this.isFile = isFile;
        this.isParent = isParent;
    }
}

export class AdobeAccess {
    public accessToken: string;
    public sub: string;
    public idToken: string;
    public tokenType: string;
    public expiresIn: string;

    constructor(accessToken: string = '', sub: string = '', idToken: string, tokenType: string, expiresIn: string) {
        this.accessToken = accessToken;
        this.sub = sub;
        this.idToken = idToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
    }
}

export class AdobeLibrary {
    public id: string;
    public name: string;
    public ownership: string;
    public libraryUrn: string;
    public elementsCount: number;
    public assetSubType: string;
    public rawName: string;
    public parentAssetId: string;
    public isSelected: boolean;

    constructor(id: string = '', name: string = '', ownership: string = '', libraryUrn: string = '', elementsCount: number = 0,
                assetSubType: string = '', rawName: string = '', parentAssetId: string = '') {
        this.id = id;
        this.name = name;
        this.ownership = ownership;
        this.libraryUrn = libraryUrn;
        this.elementsCount = elementsCount;
        this.assetSubType = assetSubType;
        this.rawName = rawName;
        this.parentAssetId = parentAssetId;
        this.isSelected = false;
    }
}

export class AdobeLibraryElement {
    public id: string;
    public name: string;
    public type: string;
    public thumbnail: string;
    public assetSubType: string;
    public isSelected: boolean;

    constructor(id: string = '', name: string = '', type: string = '', thumbnail: string = '', assetSubType: string = '') {
        this.id = id;
        this.name = name;
        this.type = type;
        this.thumbnail = thumbnail;
        this.assetSubType = assetSubType;
        this.isSelected = false;
    }
}
