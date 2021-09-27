import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  
  deletePrintRequest(url: string, data: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data
    }
    return this.http.delete(url, options);
  }
}
