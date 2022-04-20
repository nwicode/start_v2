import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

    transform(value: any[], filterText: string, filterType: string): unknown {
        return value.filter(item => {
            if (filterType.toLowerCase() === 'all') {
                if (JSON.stringify(item).toLowerCase().includes(filterText)) {
                    return true;
                }
            } else if (filterType.toLowerCase() === 'normal') {
                if (JSON.stringify(item).toLowerCase().includes(filterText)
                    && !JSON.stringify(item).toLowerCase().includes('-outline')
                    && !JSON.stringify(item).toLowerCase().includes('-sharp')) {
                    return true;
                }
            } else {
                if (JSON.stringify(item).toLowerCase().includes(filterText) && JSON.stringify(item).toLowerCase().includes(filterType.toLowerCase())) {
                    return true;
                }
            }
        });
    }

}
