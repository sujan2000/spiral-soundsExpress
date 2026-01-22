import { supabase } from '../db/db.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.sb_token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });

    req.user = data.user; // attach Supabase user to request
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
};
