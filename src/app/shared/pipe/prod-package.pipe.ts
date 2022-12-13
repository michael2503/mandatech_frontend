import { Pipe, PipeTransform } from '@angular/core';
import { delay, map } from 'rxjs';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Pipe({
    name: 'prodPackage',
})
export class ProdPackagePipe implements PipeTransform {
    constructor(private genS: GeneralSettingsService) {}

    transform(value: any, o = 'min_pv'): any {
        if (!value) return null;
        return this.genS.genSettings.pipe(
            map((res) => {
                if (res) {
                    let packages = res.packages;
                    let matchPack = packages.find((p) => p.id == value);
                    return matchPack[o];
                }
            })
        );
    }
}
