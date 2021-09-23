import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { PrintCenterApiService } from './print-center-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  docs: any[] = [];

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
          }
        }
      )
  }

  docSelection: FormGroup = this.fb.group({
    print: new FormControl(''),
    color: new FormControl(''),
    notes: new FormControl(''),
  })

  docSelections: FormArray = this.fb.array([this.docSelection]);

  printCenterOptions = this.fb.group({
    deliverTo: new FormControl(''),
    specialInstructions: new FormControl(''),
    selections: this.docSelections
  });


  onSubmit(): void {
    console.log('submitted')
  }
}

