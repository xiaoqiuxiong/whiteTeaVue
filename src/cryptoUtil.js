/**
 * 工具类
 */
import Vue from 'vue'
import CryptoJS from 'crypto-js'

export default { //加密
  encrypt(word) {
    var key = '12345678910Asdfx' //密钥
    var iv = '12345678910Asdfx'; //密钥偏移量
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(word, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = encrypted.toString();
    return decryptedStr;
  },
  //解密
  decrypt(word) {
    var key  = CryptoJS.enc.Utf8.parse('12345678910Asdfx');
    var iv   = CryptoJS.enc.Utf8.parse('12345678910Asdfx');
    var decrypted =CryptoJS.AES.decrypt(word,key,
        {
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);     
  }

}
