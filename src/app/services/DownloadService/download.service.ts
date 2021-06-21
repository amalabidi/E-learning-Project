import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http:HttpClient) { }
  download(url,file){
    return(this.http.post(url,file,{ responseType: 'blob'}))
  }
  downloadFile(url,file){
    return(this.http.post(url,file,{ responseType: 'blob'}))
  }
}
