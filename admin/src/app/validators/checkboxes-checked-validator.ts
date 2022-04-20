import {FormGroup} from '@angular/forms';

export class CheckboxesCheckedValidator {

    /**
     * Check if at least 1 checkboxes are checked in group.
     *
     * @param formGroup group with controls
     */
    static requireOneCheckboxToBeChecked(formGroup: FormGroup): {[key: string]: boolean} {
        let checked = 0;

        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.controls[key];

            if (control.value == true) {
                checked ++;
            }
        });

        if (checked < 1) {
            return {
                requireCheckboxesToBeChecked: true,
            };
        }

        return null;
    }
}