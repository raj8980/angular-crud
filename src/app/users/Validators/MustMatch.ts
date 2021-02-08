import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function maxDate(minControlName: string, maxControlName: string) {
    return (formGroup: FormGroup) => {
        const minControl = formGroup.controls[minControlName];
        const maxControl = formGroup.controls[maxControlName];

        if (maxControl.errors && !maxControl.errors.maxDate) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        if (maxControl.value > minControl.value) {
            maxControl.setErrors(null);

        } else {
            maxControl.setErrors({ maxDate: true });
        }
    }
}

export function numberValidator(controlName: string): any {
    const regex = /^\d{1,12}\.?\d{0,2}$/;
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        if (control.errors && !control.errors.decimalFormat) {
            return;
        }

        if (regex.test(control.value)) {
            control.setErrors(null);
        } else {
            control.setErrors({ decimalFormat: true });
        }

    };
}

