import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintCenterApiService {

  constructor( private http: HttpClient) {
  }

  getDocuments(url: string): Observable<any[]> {
    return this.http.get<[any]>(url);
  }

  sendPrintRequest(url: string, data: any) {
      return this.http.put(url, data);
  } 
}
