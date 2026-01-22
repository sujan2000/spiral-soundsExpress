import { supabase } from '../db/db.js';

/* Register User */
export async function registerUser(req, res) {
  const { email, password, username, name } = req.body;

  if (!email || !password || !username || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
    return res.status(400).json({ error: 'Username must be 1–20 characters' });
  }

  try {
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username, name },
      email_confirm: true,
    });

    if (error) throw error;

    // Add user to users table
    const { error: dbError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,
        name,
        email,
        username,
      }]);

    if (dbError) throw dbError;

    res.status(201).json({ message: 'User registered', userId: data.user.id });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
}

/* Login User */
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;

    // Set HTTP-only cookie
    res.cookie('sb_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    // Store session in express-session
    req.session.userId = data.user.id;
    req.session.user = data.user;

    res.json({ message: 'Logged in', user: data.user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ error: 'Invalid credentials', details: err.message });
  }
}

/* Logout User */
export async function logoutUser(req, res) {
  try {
    // Clear session and cookies
    res.clearCookie('sb_token');
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err.message);
        return res.status(500).json({ error: 'Logout failed', details: err.message });
      }
      res.json({ message: 'Logged out successfully' });
    });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ error: 'Logout failed', details: err.message });
  }
}
