import { Pipe, PipeTransform } from '@angular/core';
import { LocationsService } from 'src/app/data/localdata/locations.service';

@Pipe({
  name: 'phoneCode',
})
export class PhoneCodePipe implements PipeTransform {
  constructor(private locS: LocationsService) {}

  transform(country: string): any {
    if (!country) return country;
    return `+${this.locS.countriesAndStates
      .find((l) => l.name == country)
      .phone_code.replace(/^\+/, '')}`;
  }
}
