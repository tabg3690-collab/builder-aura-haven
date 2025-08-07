import type { Context, Config } from "@netlify/functions";
import { neon } from '@neondatabase/serverless';

const sql = neon(Netlify.env.get('NEON_DATABASE_URL') || '');

export default async (req: Request, context: Context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const url = new URL(req.url);
    const method = req.method;

    switch (method) {
      case 'POST':
        if (url.pathname.includes('/login')) {
          // User login
          const { email, password } = await req.json();
          const users = await sql`
            SELECT id, email, role, name FROM users 
            WHERE email = ${email} AND password_hash = ${password}
          `;
          
          if (users.length > 0) {
            // Update last login
            await sql`UPDATE users SET last_login = NOW() WHERE id = ${users[0].id}`;
            return new Response(JSON.stringify(users[0]), { headers });
          } else {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { 
              status: 401, 
              headers 
            });
          }
        }
        break;

      case 'GET':
        if (url.pathname.includes('/users')) {
          // Get all users (admin only)
          const users = await sql`
            SELECT id, email, role, name, created_at FROM users 
            ORDER BY created_at
          `;
          return new Response(JSON.stringify(users), { headers });
        }
        break;

      default:
        return new Response('Method not allowed', { status: 405, headers });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers 
    });
  }
};

export const config: Config = {
  path: "/api/auth"
};
