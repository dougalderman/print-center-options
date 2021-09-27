import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { PrintCenterApiService } from './services/print-center-api.service';

const unPrintable: string[] = [
  'zip',
  'tar'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  docs: string[] = [];
  successfulSubmit: boolean = false;
  successfulCancel: boolean = false;
 
  printCenterOptions: FormGroup = this.fb.group({
    deliverTo: ['owner'],
    specialInstructions: [''],
    selections: this.fb.array([
      this.fb.group({
        filename: [''],
        print: [false],
        color: [false],
        notes: ['']
      })  
    ])
  });


  get selections() {
    return this.printCenterOptions.get('selections') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private apiService: PrintCenterApiService
    ) {
  }

  ngOnInit() {
    this.apiService.getDocuments('http://demo6343436.mockable.io/')
      .subscribe(
        (data: any) => {
          if (data && data.documents && data.documents.filename && data.documents.filename.length) {
            this.docs = data.documents.filename;
           
            for (let i = 0; i < this.docs.length; i++) {
              const doc: string = this.docs[i];
              const printable: boolean = this.checkIfPrintableFilename(doc);
              
              if (i === 0) {
                this.selections.setControl(0, 
                  this.fb.group({
                    filename: {value: doc, disabled: !printable},
                    print: {value: false, disabled: !printable},
                    color: {value: false, disabled: !printable},
                    notes: {value: '', disabled: !printable}
                  })  
                );
              }
              else {
                this.selections.push(
                  this.fb.group({
                    filename: {value: doc, disabled: !printable},
                    print: {value: false, disabled: !printable},
                    color: {value: false, disabled: !printable},
                    notes: {value: '', disabled: !printable}
                  })  
                );
              }  
            }
          }
        }  
      );
  }

  checkIfPrintableFilename(fileName: string): boolean {
    const ext = fileName.slice(fileName.indexOf('.') + 1)
    
    if (fileName && unPrintable.find(el => el===ext)) {
      return false;
    }
    else {
      return true;
    }
  }

  onSubmit(): void {
    const formattedFormData = this.getDataFromForm();
    this.apiService.sendPrintRequest('http://demo6343436.mockable.io/', formattedFormData)
      .subscribe(
        (data: any) => {
          this.successfulSubmit = true;
        });  
  }

  onCancel(): void {
    const deleteRequestData = {
      'cancel': { 'printJobId': '987654321' }
    }

    this.apiService.deletePrintRequest('http://demo6343436.mockable.io/', deleteRequestData)
    .subscribe(
      (data: any) => {
        this.successfulSubmit = false;
        this.successfulCancel = true;
      });  
    console.log('cancelled');
  }

  getDataFromForm(): any {
    let formattedFormData: any = {};
    let formattedDocumentData: any[] = [];

    let docs = this.printCenterOptions.controls.selections as FormArray;

    for (let control of docs.controls) {
      console.log('control: ', control);
      if (control.value.print) {
        formattedDocumentData.push({
          'filename': control.value.filename,
          'color': control.value.color,
          'notes': control.value.notes
        });
      }
    }

    formattedFormData.printRequest = {
      deliverTo: this.printCenterOptions.controls.deliverTo.value,
      instructions: this.printCenterOptions.controls.specialInstructions.value,
      documents: {
        document: formattedDocumentData
      }
    }
    
    return formattedFormData;
  }
}

