export async function getCurrentUser(req, res) {
  if (!req.user) return res.json({ isLoggedIn: false });
  const { user_metadata, email, id } = req.user;

  res.json({
    isLoggedIn: true,
    id,
    name: user_metadata.name,
    username: user_metadata.username,
    email,
  });
}
