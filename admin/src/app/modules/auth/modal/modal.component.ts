import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './modal.component.html',
    selector: 'app-auth-modal',
})
export class ModalComponent {
    @Input() content;
    @Input() header;
    constructor(public activeModal: NgbActiveModal) {
    }
}
