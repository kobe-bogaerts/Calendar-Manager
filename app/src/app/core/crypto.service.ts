import { Injectable } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { LoginStore } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private nonce = "PpLiu78f7sYfaouV7L9d";
  constructor() { }

  generateHmac(loginStore: LoginStore){
    const hashDigest = sha256(this.nonce);
    return Base64.stringify(hmacSHA512(loginStore.username + hashDigest, loginStore.pass));
  }
}
