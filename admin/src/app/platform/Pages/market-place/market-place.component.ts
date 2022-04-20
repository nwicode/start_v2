import {Component, OnInit} from '@angular/core';
import {SubheaderService} from '../../framework/partials/layout';

@Component({
    selector: 'app-market-place',
    templateUrl: './market-place.component.html',
    styleUrls: ['./market-place.component.scss']
})
export class MarketPlaceComponent implements OnInit {

    constructor(private subheader: SubheaderService) {
    }

    ngOnInit(): void {
    }

}
