import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta } from '../Models/cuenta';

export interface TransferRequest {
  cuentaOrigenID: number;
  cuentaDestinoID: number;
  monto: number;
}

interface MontoRequest {
  monto: number;
}

@Injectable({
  providedIn: 'root'
})
export class CuentaServicio {

  private apiUrl = 'http://localhost:5094/api/Cuenta';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Cuenta[]> {
    return this.http.get<[Cuenta]>(this.apiUrl);
  }

  deleteAccount(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateAccount(id: number, account: any) {
    return this.http.put(`${this.apiUrl}/${id}`, account);
  }

  createAccount(account: any) {
    return this.http.post(this.apiUrl, account);
  }

  deposit(id: number, amount: number) {
    const body: MontoRequest = { monto: amount };
    return this.http.patch<Cuenta>(`${this.apiUrl}/${id}/ingreso`, body);
  }

  withdraw(id: number, amount: number) {
    const body: MontoRequest = { monto: amount };
    return this.http.patch<Cuenta>(`${this.apiUrl}/${id}/salida`, body);
  }

  transfer(request: TransferRequest) {
    return this.http.post(`${this.apiUrl}/transfer`, request);
  }

}
