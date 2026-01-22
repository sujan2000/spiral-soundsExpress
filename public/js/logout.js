export async function logout() {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    if (res.ok) {
      window.location.href = '/'
    }
  } catch (err) {
    console.error('Failed to log out:', err)
    window.location.href = '/'
  }
}