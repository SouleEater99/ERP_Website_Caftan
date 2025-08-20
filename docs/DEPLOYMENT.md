# Production Deployment Guide

This document provides comprehensive instructions for deploying the Caftan Talia Production Management System to production.

## Prerequisites

Before deploying to production, ensure you have:

1. **Supabase Project Setup**
   - Created a Supabase project at [supabase.com](https://supabase.com)
   - Obtained your project URL and anon key
   - Configured authentication settings

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables
   - Ensure production URLs are used (not localhost)

3. **Database Setup**
   - Run all migrations in the `supabase/migrations/` directory
   - Verify Row Level Security (RLS) policies are working correctly
   - Create initial admin user

## Critical Setup Steps

### 1. Database Migration

Run the following migrations in order:

```bash
# Apply the main schema migration
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/20250817182801_sweet_recipe.sql

# Apply the locations table migration
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/create_locations_table.sql
```

### 2. Environment Configuration

Create a `.env` file with production values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Production monitoring
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id

# Environment
VITE_APP_ENV=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### 3. Supabase Configuration

#### Authentication Settings
1. Go to Authentication > Settings in your Supabase dashboard
2. Configure the following:
   - **Site URL**: Your production domain
   - **Redirect URLs**: Add your production domain
   - **Email confirmation**: Enable for production security
   - **Password requirements**: Set minimum 8 characters

#### Row Level Security
Verify these policies are active:

**Users Table:**
- `Users can read own data`: Allows users to read their own profile
- `Only admins can modify users`: Restricts user management to admins

**Locations Table:**
- `All authenticated users can read locations`
- `Only admins can insert/update/delete locations`

**Work Logs Table:**
- `Workers can insert own logs`
- `Workers can read own logs`
- `Supervisors and admins can read all logs`

### 4. Initial Admin User

Create your first admin user through the Supabase dashboard:

1. Go to Authentication > Users
2. Click "Add user"
3. Enter admin email and password
4. After creation, go to Table Editor > users
5. Add a record with the user's ID and role = 'admin'

## Build and Deployment

### Local Build Test

```bash
# Install dependencies
npm install

# Run type checking
npm run lint

# Build for production
npm run build

# Test production build locally
npm run preview
```

### Deployment Options

#### Option 1: Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

#### Option 2: Vercel
1. Connect repository to Vercel
2. Set framework preset to "Vite"
3. Add environment variables
4. Deploy

#### Option 3: Traditional Hosting
1. Build the project: `npm run build`
2. Upload `dist/` folder contents to your web server
3. Configure web server for SPA routing

## Post-Deployment Checklist

### 1. Functionality Testing
- [ ] User authentication (login/logout)
- [ ] User registration (admin only)
- [ ] Password reset functionality
- [ ] All CRUD operations for each module
- [ ] Role-based access control
- [ ] Data export functionality

### 2. Security Verification
- [ ] HTTPS is enforced
- [ ] Environment variables are not exposed
- [ ] RLS policies are working correctly
- [ ] Authentication redirects work properly
- [ ] Admin-only features are protected

### 3. Performance Testing
- [ ] Page load times are acceptable
- [ ] Database queries are optimized
- [ ] Images and assets are compressed
- [ ] Caching headers are set correctly

### 4. Monitoring Setup
- [ ] Error tracking is working (Sentry)
- [ ] Analytics are collecting data (Google Analytics)
- [ ] Health checks are responding
- [ ] Database monitoring is active

## Maintenance and Updates

### Regular Tasks
1. **Database Backups**: Set up automated daily backups in Supabase
2. **Security Updates**: Keep dependencies updated
3. **Performance Monitoring**: Review analytics and error reports weekly
4. **User Management**: Regular audit of user accounts and permissions

### Update Procedure
1. Test changes in development environment
2. Create database migration if needed
3. Deploy to staging environment
4. Run full test suite
5. Deploy to production during low-traffic hours
6. Monitor for errors post-deployment

## Troubleshooting

### Common Issues

**Authentication Errors:**
- Check Supabase URL and keys
- Verify redirect URLs are configured
- Ensure RLS policies allow user access

**Database Connection Issues:**
- Verify environment variables
- Check Supabase project status
- Review network connectivity

**Build Failures:**
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all environment variables are set

### Support Contacts
- **Technical Issues**: Check application logs and Supabase dashboard
- **Database Issues**: Review Supabase logs and metrics
- **Performance Issues**: Use browser dev tools and monitoring dashboards

## Security Considerations

### Production Security Checklist
- [ ] All API keys are properly secured
- [ ] HTTPS is enforced everywhere
- [ ] Content Security Policy (CSP) is configured
- [ ] Rate limiting is implemented
- [ ] Input validation is comprehensive
- [ ] Error messages don't leak sensitive information
- [ ] Regular security audits are scheduled

### Data Protection
- [ ] User data is encrypted at rest
- [ ] Sensitive operations are logged
- [ ] Data retention policies are implemented
- [ ] GDPR compliance measures are in place (if applicable)

## Performance Optimization

### Frontend Optimizations
- Code splitting is implemented
- Images are optimized and compressed
- Unused dependencies are removed
- Bundle size is monitored

### Backend Optimizations
- Database indexes are properly configured
- Query performance is monitored
- Connection pooling is optimized
- Caching strategies are implemented

This deployment guide ensures your Caftan Talia Production Management System is properly configured, secure, and ready for production use.