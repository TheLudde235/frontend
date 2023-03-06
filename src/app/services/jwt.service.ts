import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class JWTService {

  constructor() { }
  getData(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      console.error(err);
      return 
    }
  }
}
