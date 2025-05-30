import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from "crypto-js";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7291/api';

  constructor(private http: HttpClient) { }

  register(registerData: any): Observable<any> {
  registerData.HashedPassword = this.encrypt(registerData.HashedPassword); 
  return this.http.post<any>(`${this.apiUrl}/Users/register`, registerData);
}


  login(loginData: any): Observable<any> {
    const params = new HttpParams()
        .set('UserName', loginData.UserName)
        .set('PasswordHash', this.encrypt(loginData.PasswordHash));

    return this.http.get(`${this.apiUrl}/Login`, { params });
}




 encrypt(plainText: string): string {
  const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012"); // 32 bytes
  const iv = CryptoJS.enc.Utf8.parse("6543210987654321"); // 16 bytes

  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString(); // Base64
}

changePassword(passwordData: any): Observable<any> {

  const params = new HttpParams()
  .set('UserId', passwordData.userId)
  .set('OldPassword', this.encrypt(passwordData.oldPassword))
  .set('NewPassword', this.encrypt(passwordData.newPassword));

  return this.http.put(`${this.apiUrl}/Login/update-password`, null, { params });
}         
forgetPassword(email: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/Login/forget-password?email=${email}`, null);
}

}
