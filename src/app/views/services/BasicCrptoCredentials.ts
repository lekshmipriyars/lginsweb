/**
 * Created by priya on 09/07/18.
 */

import * as CryptoJS from 'crypto-js/crypto-js';

export class BasicCrptoCredentials {
    msg:string;
    encryptionKeyValue="INSLGSECURED1234";
    constructor() {

    }

    encryptByAES(msg):string {
        var key = CryptoJS.enc.Utf8.parse(this.encryptionKeyValue);
        var iv = CryptoJS.enc.Utf8.parse(this.encryptionKeyValue);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(msg), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
        //  $log.debug('Encrypted :' + encrypted);
        return encrypted.toString();


    }


    decryptByAES(ciphertext):string {
        if(ciphertext!=undefined) {
            var ciperText = ciphertext.replace(/(\r\n|\n|\r)/gm, "");
            var key = CryptoJS.enc.Utf8.parse(this.encryptionKeyValue);
            var iv = CryptoJS.enc.Utf8.parse(this.encryptionKeyValue);
            var decrypted = CryptoJS.AES.decrypt(ciperText, key,
                {
                    keySize: 128 / 8,
                    iv: iv,
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
            //  $log.debug('Encrypted :' + encrypted);
            return decrypted.toString(CryptoJS.enc.Utf8);
        }

    }
}