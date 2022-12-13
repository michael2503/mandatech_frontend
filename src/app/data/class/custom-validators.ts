import { AbstractControl } from "@angular/forms";

export class CustomValidators {
    static futureDateCheck(c: AbstractControl): { [key: string]: boolean } | null {
        let current = new Date();
        let passD = new Date(c.value);
        if (passD.getTime() > current.getTime()) {
            return { future: true };
        }
        return null;
    }
}
