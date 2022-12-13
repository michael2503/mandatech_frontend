import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from 'src/app/data/services/config.service';

@Pipe({
  name: 'treatImgUrl',
})
export class TreatImgUrlPipe implements PipeTransform {
  private baseUrl;
  constructor(config: ConfigService) {
    this.baseUrl = config.baseUrl;
  }

  transform(imgurl: any): any {
    if (!imgurl || typeof imgurl != 'string' || !imgurl.match(/^(http)/))
      return;
    imgurl = imgurl.toString();
    let baseIp = this.baseUrl.split('//')[1].split('/')[0];
    let imgIp = imgurl.split('//')[1].split('/')[0];
    return imgIp.match(/localhost:*\d*/) ||
      imgIp.match(/\d+\.\d+\.\d+\.\d+:\d+/)
      ? imgurl.replace(imgIp, baseIp)
      : imgurl;
  }
}
