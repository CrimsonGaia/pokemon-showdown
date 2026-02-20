const fs = require('fs');
const crypto = require('crypto');

// Generate RSA keypair compatible with PS loginserver
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
});

// Write files
fs.writeFileSync('ps-login-private.pem', privateKey);
fs.writeFileSync('ps-login-public.pem', publicKey);

console.log('✅ Keys generated:');
console.log(' - ps-login-private.pem (use in loginserver)');
console.log(' - ps-login-public.pem (use in main server)');
