import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(private http:HttpClient) {}

  uploadImage(files: File[]): Observable<any> {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    return this.http.post<any>('http://3.79.86.124:8000/api/image/upload', formData);
  
  }
}
