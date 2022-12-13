import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UserSettingsService } from 'src/app/data/services/user/user-settings.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

    pageLoader = true;
    addresses = [];

    isDeleting = false;
    isUpdating = false;
    isSubmitting = false;

    theMessage: any;
    showNotice = false;
    deleteModal = false;
    justMssg = false;

    closeModal = new BehaviorSubject(false);

    form = new FormGroup({
        phone: new FormControl('', [ Validators.required ]),
        address: new FormControl('', [ Validators.required ]),
        city: new FormControl('', [ Validators.required ]),
        state: new FormControl('', [ Validators.required ]),
        country: new FormControl('', [ Validators.required ]),
    })

    formEdit = new FormGroup({
        phone: new FormControl('', [ Validators.required ]),
        address: new FormControl('', [ Validators.required ]),
        city: new FormControl('', [ Validators.required ]),
        state: new FormControl('', [ Validators.required ]),
        country: new FormControl('', [ Validators.required ]),
        id: new FormControl('', [ Validators.required ]),
    })

    f(n) {
        return this.form.get(n);
    }
    e(en) {
        return this.formEdit.get(en);
    }

    constructor(
        private userSettingsService: UserSettingsService
    ) { }

    ngOnInit(): void {
        this.allAddress();
    }


    private allAddress(){
        this.userSettingsService.getAllAddress().subscribe(res => {
            if(res){
                this.addresses = res.data;
            }
            this.pageLoader = false;
        })
    }


    submit(){
        if (this.form.invalid) return;
        this.isSubmitting = true;
        const data = JSON.stringify(this.form.value);
        this.userSettingsService.addAddress(data).subscribe(res => {
            if(res){
                this.form.reset();
                this.addresses = res.data;
                this.theMessage = "Address successfully added.";
                this.showNotice = true;
                this.justMssg = true;
                this.deleteModal = false;
                this.removeNotice();
                this.closeModal.next(true);
            }
            this.isSubmitting = false;
        })
    }


    submitEdit(){
        if (this.formEdit.invalid) return;
        this.isUpdating = true;
        const data = JSON.stringify(this.formEdit.value);
        this.userSettingsService.updateAddress(data).subscribe(res => {
            if(res){
                this.addresses = res.data;
                this.theMessage = "Address successfully updated.";
                this.showNotice = true;
                this.justMssg = true;
                this.deleteModal = false;
                this.removeNotice();
                this.closeModal.next(true);
            }
            this.isUpdating = false;
        })
    }


    removeNotice() {
        setTimeout(() => {
          if (this.showNotice = true) {
            this.showNotice = false;
          }
        }, 4000);
    }

    closeMyNotice() {
        this.showNotice = false;
    }


    addInfo;
    getEachAddress(id){
        this.addInfo = this.addresses.filter(cont => cont.id === parseInt(id))[0];

        if(this.addInfo){
            this.formEdit.get('phone').setValue(this.addInfo.phone);
            this.formEdit.get('address').setValue(this.addInfo.address);
            this.formEdit.get('city').setValue(this.addInfo.city);
            this.formEdit.get('state').setValue(this.addInfo.state);
            this.formEdit.get('country').setValue(this.addInfo.country);
            this.formEdit.get('id').setValue(this.addInfo.id);
        }
    }



  returnID;
  delShipAddress(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this shipping address?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.userSettingsService.deleteAddress(id).subscribe(res => {
        if (res.data) {
          this.addresses = res.data;
          this.theMessage = "Shipping address deleted successfully.";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
  }

}
