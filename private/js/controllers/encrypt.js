var crypto = require('crypto');

var Crypto = {};

Crypto.encrypt = function (plain_text, encryptionMethod, secret, iv) {

      var encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);

      encryptor.setEncoding('base64');
      encryptor.write(plain_text);
      encryptor.end();

      return encryptor.read();
};

Crypto.decrypt = function (encryptedMessage, encryptionMethod, secret, iv) {
      var decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
      return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8');
};

window.Crypto = Crypto;
