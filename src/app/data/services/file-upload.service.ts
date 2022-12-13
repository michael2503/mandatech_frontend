import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private serverUrl;

  constructor(private http: HttpClient, private configS: ConfigService) {
    this.serverUrl = configS.baseUrl;
  }

  upload(fileData: any, folder: string, name: string) {
    let uploadUrl = `${this.serverUrl}fileupload/${folder}/${name}`;
    if (fileData.get('file').type.includes('image')) {
      uploadUrl = 'https://api.cloudinary.com/v1_1/natures-extracts/upload';
      fileData.append('upload_preset', 'mk9saudf');
      fileData.append('api_key', '695834924697519');
    }
    return this.http.post<any>(uploadUrl, fileData, {
      reportProgress: true,
      observe: 'events',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
  }


  cloudUpload(fileData: any, folder: string, name: string,
    resize=0, width=0, height=0, mxWidth=0, mxHeight=0) {
    if (name === '0' || name === null || !name) {
      name = 'file-name';
    }
    fileData.append('upload_preset', 'nlrszekg');
    fileData.append('api_key', '389396244427845');
    // fileData.append('public_id', 'oziconnect');
    let uploadUrl = `${this.serverUrl}fileupload/${folder}/${name}`
    if (fileData.get('file').type.includes('image')) {
      uploadUrl = 'https://api.cloudinary.com/v1_1/mandatech-group/upload'
    }
    return this.http.post<any>(
      uploadUrl,
      fileData,
      {
        reportProgress: true,
        observe: 'events',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      }
    ).pipe();
  }

}
