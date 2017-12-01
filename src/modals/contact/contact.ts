import { Camera } from 'ionic-native';
import { Component, ChangeDetectorRef } from '@angular/core';
import { File } from '@ionic-native/file';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, AlertController } from 'ionic-angular';
import { Restangular } from 'ngx-restangular';
import { SharedService } from './../../providers/shared-service';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@IonicPage()
@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
})

export class Contact {

    contactForm: FormGroup;
    cardList: any = [];
    d: Date;
    fileOptions: FileUploadOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    filePath: string = this.file.dataDirectory + 'file.json';
    formSettings: any = {};
    isScanning: boolean = false;
    leadId: number;
    loadProgress: number = 0;
    mode: string = '';
    progress: string = '';
    server: string = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAJXYVMM9WdT3MpppZyhhBQmyT-Nii6_R0';
    userData$: any;

    constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular, private sharedService: SharedService, private actionSheetCtrl: ActionSheetController, private cd: ChangeDetectorRef, private alertCtrl: AlertController, private formBuilder: FormBuilder, private file: File, private transfer: Transfer) {
        this.leadId = navParams.get('leadId');
    }

    ionViewWillLoad() {
        if (this.navParams.get('editContact') == null) {
            this.mode = 'new';
            this.formNewContact();
        } else {
            this.mode = 'edit';
            this.formEditContact(this.navParams.get('editContact'));
        }
    }

    ionViewDidLoad() {
        this.userData$ = this.sharedService.GetUsersData();
    }

    formNewContact() {
        this.contactForm = this.formBuilder.group({
            // title: '',
            emailAddress: '',
            firstName: ['', Validators.required],
            fullName: '',
            id: 0,
            lastName: ['', Validators.required],
            leadId: 0,
            marketId: 0,
            mobilePhone: '',
            phone: '',
        });
    }

    formEditContact(contact) {
        this.contactForm = this.formBuilder.group({
            // birthday: contact.birthday,
            // contactMethodId: contact.contactMethodId,
            // dateModified: contact.dateModified,
            // fax: contact.fax,
            // homePhone: contact.homePhone,
            // isDecisionMaker: contact.isDecisionMaker,
            // leadId: contact.leadId,
            // note: contact.note,
            // title: contact.title
            emailAddress: contact.emailAddress,
            firstName: [contact.firstName, Validators.required],
            fullName: contact.fullName,
            id: contact.id,
            lastName: [contact.lastName, Validators.required],
            marketId: contact.marketId,
            mobilePhone: contact.mobilePhone,
            phone: contact.phone,
        });
    }

    cancelEdit() {
        let data = { userCanceled: true };
        this.view.dismiss(data);
    }

    saveDocument() {

        if (this.mode === 'new') {
            
            // This is for a new Contact
            this.contactForm.controls['marketId'].setValue(this.userData$.market.stratusMarketId);
            this.contactForm.controls['fullName'].setValue(this.contactForm.controls['firstName'].value + ' ' + this.contactForm.controls['lastName'].value);

            if (this.leadId === undefined) {
                // This is for a new contact not associated with a Lead
                this.contactForm.controls['id'].setValue('0');

                let userContact = {
                    "id": 0,
                    "userId": this.userData$.id,
                    "contact": this.contactForm.value,
                }

                this.restangular.all('Contact/AddUserContact').post(userContact);
            } else {
                // This is for a new contact linked to a Lead
                this.contactForm.controls['leadId'].setValue(this.leadId);
                this.restangular.all('Contact/AddLeadContact').post(this.contactForm.value);
            }
        } else {
            // This means that the contact is being edited and not created
            this.contactForm.controls['fullName'].setValue(this.contactForm.controls['firstName'].value + ' ' + this.contactForm.controls['lastName'].value);
            this.restangular.all('Contact/UpdateLeadContact').customPUT(this.contactForm.value);
        }

        this.view.dismiss('');
    }

    // Opens up the menu at the bottom to create new items
    openMenu() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Scan Business Card',
            buttons: [
                {
                    text: 'Choose Photo',
                    handler: () => {
                        this.choosePhoto();
                    }
                }, {
                    text: 'Take Photo',
                    handler: () => {
                        this.takePhoto();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel Clicked');
                    }
                }
            ]
        });

        actionSheet.present();
    }

    choosePhoto() {
        console.log('*** Choose Picture ***');

        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            quality: 50,
            correctOrientation: true
        }).then((image) => {
            this.recognizeText(image);
        }, (err) => {
            console.log(err);
        });
    }

    takePhoto() {
        console.log('*** Take Picture ***');

        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            quality: 50,
            correctOrientation: true
        }).then((image) => {
            this.recognizeText(image);
        }, (err) => {
            console.log(err);
        });
    }

    recognizeText(image) {
        console.log('*** recognizeText ***');

        const fileTransfer: TransferObject = this.transfer.create();

        this.isScanning = true;
        this.progress = '';

        let vision_api_json = {
            "requests": [{
                "image": {
                    "content": image
                },
                "features": [{
                    "type": "TEXT_DETECTION"
                }]
            }]
        };

        let file_contents = JSON.stringify(vision_api_json);

        this.file.writeFile(this.file.dataDirectory, 'file.json', file_contents, { replace: true })
            .then((result) => {

                console.log('*** File Written ***');

                fileTransfer.upload(this.filePath, this.server, this.fileOptions, true)
                    .then((result) => {

                        console.log('*** Parse Response ***');

                        let res = JSON.parse(result.response);
                        let key = 'textAnnotations';
                        let ocrTranslation = res.responses[0][key][0].description;

                        console.log(ocrTranslation);

                        // If able to find a phone number set the first one that matches
                        let firstPhone = ocrTranslation.match(/(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/);
                        if (firstPhone !== null) {
                            this.contactForm.controls['phone'].setValue(firstPhone[0]);
                        } else {
                            this.contactForm.controls['phone'].setValue('');
                        }

                        // If email address is found set to the emailAddress field
                        let thisEmail = ocrTranslation.match(/[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/);
                        if (thisEmail !== null) {
                            this.contactForm.controls['emailAddress'].setValue(thisEmail[0]);
                        } else {
                            this.contactForm.controls['emailAddress'].setValue('');
                        }

                        this.cardList = ocrTranslation.split(/\n/);
                        this.cardList = this.cardList.filter(function (v) { return v; });

                        this.progress = 'Scan Completed';

                        this.cd.detectChanges();
                    })
                    .catch(err => {
                        console.log('Error in fileTransfer');
                        console.log(err);
                    });

            })
            .catch(err => {
                console.log('Error in writeFile');
                console.log(err);
            });
    }

    // The list of ocr translations for the popup list
    showOCR(field) {
        // Object with options used to create the alert
        var options = {
            title: 'Scanned Translations',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel Clicked');
                    }
                }, {
                    text: 'OK',
                    handler: data => {
                        this.setField(field, data);
                    }
                }
            ],
            inputs: []
        };

        // Now we add the radio buttons
        for (let i = 0; i < this.cardList.length; i++) {
            options.inputs.push({ name: 'options', value: this.cardList[i], label: this.cardList[i], type: 'radio' });
        }

        // Create the alert with the options
        let alert = this.alertCtrl.create(options);
        alert.present();
    }

    // Set the value for whatever field is using the options
    setField(field, value) {
        switch (field) {
            case 'firstName': {
                this.contactForm.controls['firstName'].setValue(value);
                break;
            }
            case 'lastName': {
                this.contactForm.controls['lastName'].setValue(value);
                break;
            }
            case 'title': {
                this.contactForm.controls['title'].setValue(value);
                break;
            }
            case 'emailAddress': {
                this.contactForm.controls['emailAddress'].setValue(value);
                break;
            }
            case 'phone': {
                this.contactForm.controls['phone'].setValue(value);
                break;
            }
            case 'mobilePhone': {
                this.contactForm.controls['mobilePhone'].setValue(value);
                break;
            }
        }
    }
}
