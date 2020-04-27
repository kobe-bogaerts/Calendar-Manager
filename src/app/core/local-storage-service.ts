import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  putObject(key: string, value: object){
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  putInt(key: string, value: number){
    sessionStorage.setItem(key, value+'');
  }

  putString(key: string, value: string){
    sessionStorage.setItem(key, value);
  }

  getInt(key: string): number{
    return Number.parseInt(sessionStorage.getItem(key));
  }

  getObject(key: string): object{
    return JSON.parse(sessionStorage.getItem(key));
  }

  getString(key: string): string{
    return sessionStorage.getItem(key);
  }

  remove(key: string){
    sessionStorage.removeItem(key);
  }

  putPermenantString(key: string, data: string){
    localStorage.setItem(key, data);
  }

  getPermenantString(key: string): string{
    return localStorage.getItem(key);
  }

  removePermenant(key: string){
    localStorage.removeItem(key);
  }

  hasPermanentKey(key: string): boolean{
    return !!localStorage.getItem(key)
  }
}
