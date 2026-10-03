function validate(email, password) {
  if (!email || !password) return 'Email and password are required.';
  if (!email.includes('@')) return 'Email must contain "@".';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  const error = validate(email, password);
  if (error) {
    message.textContent = error;
    return;
  }

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  message.textContent = await res.text();
});
