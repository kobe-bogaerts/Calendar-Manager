const crypto = require('crypto');
const fs = require("fs"),
path = require("path")
const algorithm = 'aes-192-cbc';
const iv = Buffer.from("4S226lVEcDEUBdkl")
const key = process.argv[2]

function decrypt(text) {
 let encryptedText = Buffer.from(text, 'hex');
 let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

let text = fs.readFileSync(path.join(__dirname, "src/environments/environment.prod.enc"), {encoding: "ascii"})
fs.writeFileSync(path.join(__dirname, "src/environments/environment.prod.ts"),decrypt(text))