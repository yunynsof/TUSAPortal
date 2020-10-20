import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  URL_SERVER: string = 'https://api.tigo.com.hn/WSSenderTigoUSA';
  authSubject = new BehaviorSubject(false);

  constructor(
    private httpClient: HttpClient
  ) { }

  getCountryCode() {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return new Promise(resolve => {
      this.httpClient.get(`${this.URL_SERVER}/countrycode`, { headers }).subscribe(data => {
        resolve(data);
      }, err => {

      });
    });
  }

  getAreaCode() {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return new Promise(resolve => {
      this.httpClient.get(`${this.URL_SERVER}/areacode`, { headers }).subscribe(data => {
        resolve(data);
      }, err => {

      });
    });
  }

  postGenerictrx(tigo, usa, comments) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let generictrx = {
      sender: tigo,
      receiver: usa,
      comments: comments
    };

    return this.httpClient.post(`${this.URL_SERVER}/tagtrigger/generictrx`, generictrx, { headers });
  }

  getValidateTel(telTigo) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return new Promise(resolve => {
      this.httpClient.get(`${this.URL_SERVER}/validate/msisdn/${telTigo}`, { headers }).subscribe(data => {
        resolve(data);
      }, err => {

        if (err.error.code == 3) {
          swal("Lo sentimos", err.error.description + "\n" + "Intente nuevamente", "warning");
        } else
          swal("Lo sentimos", "Error de conexión." + "\n" + "Intente nuevamente", "error");
      });
    });
  }

  generateOTP(telTigo) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': 'FiJ8As2XYo9VmuTvxvnTYCHuCAM3SBNH'
    });

    let otp = {
      text: "El codigo de seguridad que solicitaste es {token}. Personal de TIGO NUNCA solicitara tu codigo, es confidencial y personal. No lo compartas con otra persona.",
      token: {
        length: 6,
        type: "numeric",
        ttl: 300
      }
    };

    return this.httpClient.post(`https://cors-anywhere.herokuapp.com/https://id.tigo.com/tigoid/pub/v2/country/HN/phone/${telTigo}/otp`, otp, { headers });
  }

  validateOTP(telTigo, code) {
    const headers = new HttpHeaders({
      'apikey': 'FiJ8As2XYo9VmuTvxvnTYCHuCAM3SBNH'
    });

    return new Promise(resolve => {
      this.httpClient.get(`https://cors-anywhere.herokuapp.com/https://id.tigo.com/tigoid/pub/v2/country/HN/phone/${telTigo}/otp/${code}`, { headers }).subscribe(data => {
        resolve(data);
      }, err => {

      });
    });
  }

  getCount(telTigo) {

    return new Promise(resolve => {
      this.httpClient.get(`${this.URL_SERVER}/tagtrigger/generictrx/count/${telTigo}`).subscribe(data => {
        resolve(data);
      }, err => {

        swal("Lo sentimos", err.error.description, "error");
      });
    });
  }

}
