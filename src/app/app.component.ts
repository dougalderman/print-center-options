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
    this.apiService.getDocuments('./assets/print-center-data.json')
      .subscribe(
        (data: any) => {
          console.log('data: ', data);
          if (data && data.documents && data.documents.filename && data.documents.filename.length) {
            this.docs = data.documents.filename;
            console.log('this.docs: ', this.docs);
           
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

            console.log('this.selections.controls: ', this.selections.controls);
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
    const formData = this.getDataFromForm();
    this.apiService.sendPrintRequest('./assets/successful-print-job.json', formData)
      .subscribe(
        (data: any) => {
          console.log('data: ', data);
        });  

    console.log('submitted');
  }

  onCancel(): void {
    console.log('cancelled');
  }

  getDataFromForm(): any {
    return {};
  }
}

