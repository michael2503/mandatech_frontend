import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FileUploadService } from 'src/app/data/services/file-upload.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
    @Input() label;
    @Input() fc: AbstractControl;
    @Input() id = 'file';
    @Input() folder;

    fileUpErr;

    selectedFile;

    url;

    uploadProgress = 0;

    constructor(private fileUpS: FileUploadService) {}

    ngOnInit(): void {}

    onSelect(e) {
        const file = e.target.files[0];
        this.selectedFile = file;
        this.url = URL.createObjectURL(file);
        const fd = new FormData();
        fd.append('file', file, file.name);
        this.fileUpS
            .upload(fd, this.folder, file.name.split('.')[0])
            .subscribe((res) => {
                if (res.type == HttpEventType.UploadProgress) {
                    this.uploadProgress = (res.loaded * 100) / res.total;
                }
                if (res.type == HttpEventType.Response) {
                    this.url = file.type.includes('image')
                    ? res.body.secure_url
                    : res.body.data;
                    this.fc.setValue(this.url);
                }
            }, err => {
                this.fileUpErr = err?.error?.error;
            });
    }
}
