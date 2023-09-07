import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http:HttpClient) { }
  sendOrder (data:any){
    return this.http.post('https://64f0fad28a8b66ecf77a4d5d.mockapi.io/burgers-order', data)
  }
}
