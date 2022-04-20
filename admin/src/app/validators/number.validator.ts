import {FormControl} from "@angular/forms";

export class NumberValidator {
    /**
     * Checks if the control contains positive number or -1.
     *
     * @param control
     */
    static checkPositiveOrMinusOne(control: FormControl): {[key: string]: boolean} {
        let value = String(control.value);
        if (control.value && (control.value != -1 && !value.match(/^[0-9]*[.]?[0-9]+$/))) {
            return {checkPositiveOrMinusOne: true};
        }
        return null;
    }

    /**
     * Checks if the control contains positive number.
     *
     * @param control
     */
    static checkPositive(control: FormControl): {[key: string]: boolean} {
        let value = String(control.value);
        if (control.value && !value.match(/^[0-9]*[.]?[0-9]+$/)) {
            return {checkPositive: true};
        }
        return null;
    }

    /**
     * Checks if the control contains not fractional number greater than 0.
     *
     * @param control
     */
    static checkIntegerGreater0(control: FormControl): {[key: string]: boolean} {
        let value = String(control.value);
        if (control.value && !value.match(/^[1-9]+[0-9]*$/)) {
            return {checkIntegerPositive: true};
        }
        return null;
    }

    /**
     * Checks if the control contains positive not fractional number.
     *
     * @param control
     */
    static checkIntegerPositive(control: FormControl): {[key: string]: boolean} {
        let value = String(control.value);
        if (control.value && (value !== '0' && !value.match(/^[1-9]+[0-9]*$/))) {
            return {checkIntegerPositive: true};
        }
        return null;
    }
}