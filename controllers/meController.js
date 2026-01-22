export async function getCurrentUser(req, res) {
  if (!req.user) {
    return res.json({ isLoggedIn: false });
  }

  const { user_metadata = {}, email, id } = req.user;

  res.json({
    isLoggedIn: true,
    id,
    name: user_metadata.name || email.split('@')[0], // Fallback to email username
    username: user_metadata.username || email.split('@')[0], // Fallback to email username
    email,
  });
}
