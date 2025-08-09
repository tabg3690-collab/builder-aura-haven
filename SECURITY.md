# Security Guidelines

## Database Setup

### Default Passwords

The SQL setup files contain temporary default passwords that **MUST** be changed after initial setup:

- `admin@gmail.com` - Default password: `TempPass123!`
- `haricharan@gmail.com` - Default password: `TempPass456!`

### After Setup Steps:

1. **Change default passwords immediately**
2. **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
3. **Remove demo data** in production
4. **Limit database access** to authorized users only

## Environment Variables

Never commit these to Git:

- `NEON_DATABASE_URL` - Keep in Netlify environment only
- Any API keys or secrets

## File Safety in GitHub

✅ **Safe to commit:**

- Database schema (CREATE TABLE statements)
- Sample/demo data
- Migration scripts

❌ **Never commit:**

- Real connection strings
- Production passwords
- API keys
- Personal information

## Current Status

This repository contains development setup files only. No production secrets are included.
