# Simple Secure Login Form

A basic login page modeled on OWASP Juice Shop, made for CSCE 477 HW 2-B.

- **Client-side validation** (`script.js`): no empty fields, email must contain `@`, password must be at least 8 characters.
- **Server-side validation** (`server.js`): runs the same checks again, because client-side checks can be bypassed.
- Passwords are stored as salted scrypt hashes.
- Messages are shown with `textContent`, and a Content-Security-Policy is set, to prevent XSS.
- No SQL is used. Users are looked up by exact key, so there is no query to inject into.

## How to run
Requires Node.js. There is nothing to install.

```
node server.js
```

Open http://localhost:3000 and log in with `admin@juice-sh.op` / `admin12345`.
