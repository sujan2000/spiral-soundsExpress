// HTML escape function to prevent XSS
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

const signinForm = document.getElementById('signin-form')
const errorMessage = document.getElementById('error-message')

signinForm.addEventListener('submit', async (e) => {
  e.preventDefault() // Prevent form from reloading the page

  const email = document.getElementById('signin-username').value.trim()
  const password = document.getElementById('signin-password').value.trim()
  const submitBtn = signinForm.querySelector('button')

  errorMessage.textContent = '' // Clear old error messages
  submitBtn.disabled = true

  // Client-side validation
  if (!email || !password) {
    errorMessage.textContent = 'Email and password are required.'
    submitBtn.disabled = false
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMessage.textContent = 'Please enter a valid email address.'
    submitBtn.disabled = false
    return
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', 
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) { 
      errorMessage.textContent = ''
      window.location.href = '/'
    } else {
      errorMessage.textContent = escapeHtml(data.error || 'Login failed. Please try again.')
    }
  } catch (err) {
    console.error('Network error:', err)
    errorMessage.textContent = 'Unable to connect. Please try again.'
  } finally {
    submitBtn.disabled = false
  }
})
