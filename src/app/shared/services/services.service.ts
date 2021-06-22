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
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(`http://192.168.159.13:7004/mobile/tigo/hn/otp/create/msisdn/${telTigo}/consumer/24`,{headers});
  }

  validateOTP(telTigo, code) {
 
    return new Promise(resolve => {
      this.httpClient.get(`http://192.168.159.13:7004/mobile/tigo/hn/otp/validate/msisdn/${telTigo}/otp/${code}/consumer/24`).subscribe(data => {
        resolve(data);
      }, err => { 
		 if (err.error.error.text == 'OTP Incorrecto') {
            swal("Lo sentimos", "El código ingresado no es el correcto" + "\n" + "Intente nuevamente", "warning");
          }else swal("Lo sentimos", "Ha ocurrido un error" + "\n" + "Intente nuevamente o genere un nuevo código", "warning");
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
