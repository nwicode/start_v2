import {Component, OnInit} from '@angular/core';

export class InstalledSolution {
    public name: string;
    public developer: string;
    public version: string;
    public lastUpdate: Date;
    public updateUntil: Date;
    public status: boolean;

    constructor(name: string, developer: string, version: string, lastUpdate: Date, updateUntil: Date, status: boolean) {
        this.name = name;
        this.developer = developer;
        this.version = version;
        this.lastUpdate = lastUpdate;
        this.updateUntil = updateUntil;
        this.status = status;
    }

    static factory(): InstalledSolution {
        const name = ['Biniam Kassahun', 'George Ben', 'Netsanet Getnet', 'Roger Mulugeta'][Math.floor(Math.random() * 4)];
        const developer = ['Biniam Kassahun', 'George Ben', 'Netsanet Getnet', 'Roger Mulugeta'][Math.floor(Math.random() * 4)];
        const version = ['V 2.0', 'V 1.0', 'V 1.4', 'V 3.5', 'V 5.5'][Math.floor(Math.random() * 4)];
        const status = Math.random() * 5 > 2.5;
        return new InstalledSolution(name, developer, version, new Date(), new Date(), status);
    }
}

@Component({
    selector: 'app-installed-solutions',
    templateUrl: './installed-solutions.component.html',
    styleUrls: ['./installed-solutions.component.scss']
})
export class InstalledSolutionsComponent implements OnInit {
    public installedSolutions: InstalledSolution[] = [];

    constructor() {
        const size = Math.floor(Math.random() * 20);
        for (let x = 0; x < size; x++) {
            this.installedSolutions.push(InstalledSolution.factory());
        }
    }

    ngOnInit(): void {
    }

}
