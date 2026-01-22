import { supabase } from '../db/db.js';
import { body, validationResult } from 'express-validator';
import xss from 'xss';

// Input validation middleware
export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('username')
    .matches(/^[a-zA-Z0-9_-]{1,20}$/)
    .withMessage('Username must be 1-20 characters (alphanumeric, underscore, hyphen)'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be provided'),
];

// Sanitize user input to prevent XSS
const sanitizeInput = (str) => xss(str, { whiteList: {}, stripIgnoredTag: true });

/* Register User */
export async function registerUser(req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  let { email, password, username, name } = req.body;

  // Sanitize inputs
  email = sanitizeInput(email).trim();
  username = sanitizeInput(username).trim();
  name = sanitizeInput(name).trim();

  try {
    // Create user in Supabase Auth using admin API with auto-confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username, name },
      email_confirm: true // Auto-confirm email
    });

    if (error) {
      console.error('Supabase signup error:', error.message);
      throw error;
    }

    if (!data.user) {
      return res.status(400).json({ error: 'Failed to create user account' });
    }

    // Add user to users table
    try {
      await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          name,
          email,
          username,
        }]);
    } catch (dbErr) {
      console.error('Database insert error:', dbErr.message);
      // User created but couldn't insert to users table - still return success
    }

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: data.user.id,
      user: {
        email: data.user.email,
        username
      }
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
}

/* Login User */
export async function loginUser(req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  let { email, password } = req.body;

  // Sanitize inputs
  email = sanitizeInput(email).trim();

  try {
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      console.error('Supabase auth error:', error.message);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({ error: 'Login failed - no session created' });
    }

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

    res.json({ 
      message: 'Logged in successfully', 
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed', details: err.message });
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
