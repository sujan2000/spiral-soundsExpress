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

const signupForm = document.getElementById('signup-form')
const errorMessage = document.getElementById('error-message') 

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault() // Prevent form from reloading

  const name = document.getElementById('signup-name').value.trim()
  const email = document.getElementById('signup-email').value.trim()
  const username = document.getElementById('signup-username').value.trim()
  const password = document.getElementById('signup-password').value.trim()
  const passwordConfirm = document.getElementById('signup-password-confirm').value.trim()
  const submitBtn = signupForm.querySelector('button')

  errorMessage.textContent = '' // Clear old errors
  submitBtn.disabled = true

  // Client-side validation
  if (!name || !email || !username || !password || !passwordConfirm) {
    errorMessage.textContent = 'All fields are required.'
    submitBtn.disabled = false
    return
  }

  if (password.length < 6) {
    errorMessage.textContent = 'Password must be at least 6 characters.'
    submitBtn.disabled = false
    return
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errorMessage.textContent = 'Password must contain uppercase, lowercase, and number.'
    submitBtn.disabled = false
    return
  }

  if (password !== passwordConfirm) {
    errorMessage.textContent = 'Passwords do not match.'
    submitBtn.disabled = false
    return
  }

  if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
    errorMessage.textContent = 'Username must be 1–20 characters (letters, numbers, underscore, hyphen only).'
    submitBtn.disabled = false
    return
  }

  if (!/^[a-zA-Z\s'-]{2,50}$/.test(name)) {
    errorMessage.textContent = 'Name must be 2-50 characters (letters, spaces, hyphens, apostrophes only).'
    submitBtn.disabled = false
    return
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, username, password })
    })

    const data = await res.json()

    if (res.ok) {
      errorMessage.textContent = ''
      
      // Automatically login after signup
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      if (loginRes.ok) {
        // Successfully logged in, redirect to home
        window.location.href = '/'
      } else {
        // Signup succeeded but login failed, still redirect to login page
        window.location.href = '/login.html'
      }
    } else {
      errorMessage.textContent = escapeHtml(data.error || 'Registration failed. Please try again.')
    }
  } catch (err) {
    console.error('Network error:', err)
    errorMessage.textContent = 'Unable to connect. Please try again.'
  } finally {
    submitBtn.disabled = false
  }
})
