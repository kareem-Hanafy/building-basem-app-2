// import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

const BASE_URL = 'taboor_url';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private params: any = {};
  baseURL: string = 'https://bassimalshamary.iraqsapp.com';

  constructor(
    private http: HttpClient // private storage: Storage
  ) {}

  set addParams(body: any) {
    this.params = body;
  }

  get myParams() {
    return this.params;
  }

  getData(endPoint: string) {
    return this.http.get(this.baseURL + endPoint).pipe(take(1));
  }

  postData(endPoint: string, body: any) {
    return this.http.post(this.baseURL + endPoint, body, {
      reportProgress: true,
    });
  }

  updateData(endPoint: string, body: any) {
    return this.http.put(this.baseURL + endPoint, body).pipe(take(1));
  }

  deleteDate(endPoint: string) {
    return this.http.delete(this.baseURL + endPoint).pipe(take(1));
  }

  postOtp(endPoint: string, body: any) {
    return this.http
      .post('http://209.250.237.58:3016/otp' + endPoint, body)
      .pipe(take(1));
  }
  // changeBaseUrl(url) {
  //   this.baseURL = url;
  //   this.storage.set(BASE_URL, url)
  // }
}
