const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

function hash(password, salt = crypto.randomBytes(16).toString('hex')) {
  return salt + ':' + crypto.scryptSync(password, salt, 64).toString('hex');
}

function checkPassword(password, stored) {
  const salt = stored.split(':')[0];
  return crypto.timingSafeEqual(Buffer.from(hash(password, salt)), Buffer.from(stored));
}

const users = { 'admin@juice-sh.op': hash('admin12345') };

function validate(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password)
    return 'Email and password are required.';
  if (!/^[^\s@<>"']+@[^\s@<>"']+$/.test(email)) return 'Invalid email.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function send(res, status, type, body) {
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Security-Policy': "default-src 'self'"
  });
  res.end(body);
}

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/login') {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      let email, password;
      try { ({ email, password } = JSON.parse(raw)); } catch {}
      const error = validate(email, password);
      if (error) return send(res, 400, 'text/plain', error);
      if (users[email] && checkPassword(password, users[email]))
        return send(res, 200, 'text/plain', 'Login successful.');
      send(res, 401, 'text/plain', 'Invalid email or password.');
    });
  } else if (req.url === '/script.js') {
    send(res, 200, 'text/javascript', fs.readFileSync(__dirname + '/script.js'));
  } else {
    send(res, 200, 'text/html', fs.readFileSync(__dirname + '/index.html'));
  }
}).listen(3000, () => console.log('Running at http://localhost:3000'));
