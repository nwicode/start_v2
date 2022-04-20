import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './modal-predefined-avatars.component.html',
    selector: 'app-modal-predefined-avatars',
    styleUrls: ['./modal-predefined-avatars.component.scss'],
})
export class ModalPredefinedAvatarsComponent {
    @Input() content: string[];
    @Input() header: string;
    currentElement: any;
    currentReturnResult: string;

    constructor(public activeModal: NgbActiveModal) {
    }

    /**
     * Colors selected element
     * @param event
     */
    /*onClickAvatar(event: any) {
        if (this.currentElement) {
            this.currentElement.style.backgroundColor = 'white';
        }
        this.currentElement = event.target.parentNode.parentNode.parentNode;
        this.currentElement.style.backgroundColor = '#1BC5BD';
        this.currentReturnResult = event.target.id;
        console.log(event);
    }*/

    selectAvatar(path) {
        this.currentReturnResult = path;
    }

    /**
     * Close this modal window
     */
    closeModalWindow() {
        if (this.currentReturnResult) {
            this.activeModal.close(this.convertToBase64(this.currentReturnResult));
        } else {
            this.activeModal.close();
        }
    }

    /**
     * Convert image to base64 string
     * @param imgPath image path
     * @return base64 string
     */
    convertToBase64(imgPath: string) {
        let c = document.createElement('canvas');
        let img = <HTMLImageElement>document.getElementById(imgPath);
        c.height = img.height;
        c.width = img.width;
        let ctx = c.getContext('2d');

        ctx.drawImage(img, 0, 0, c.width, c.height);
        let base64String: string = c.toDataURL();
        return base64String;
    }
}