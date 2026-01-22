#!/bin/bash

# Instructions to get Supabase Database credentials

cat << 'EOF'
📌 How to get your Supabase Database Credentials:

1. Go to: https://app.supabase.com
2. Click on your project (Spiral Sounds Express)
3. Go to Settings → Database
4. You'll see:
   - Host: db.aqkkenguowmovzayoklt.supabase.co
   - Database: postgres
   - User: postgres
   - Password: (your database password - same one you used to create the project)

5. Update your .env file:
   SUPABASE_DB_PASSWORD=YOUR_PASSWORD_HERE

6. Or if you don't remember the password, you can reset it:
   - Settings → Database
   - Click "Reset database password"
   - Use the new password

After updating .env, restart the server:
   npm start

✅ The MemoryStore warning will disappear!
EOF
