# Development Setup Guide

This guide will help you set up the Caftan Talia Production Management System for development.

## Prerequisites

- Node.js 18+ and npm
- Git
- A Supabase account (free tier is sufficient for development)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repository-url>
cd caftan-talia-system
npm install
```

### 2. Supabase Setup

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and enter project details
   - Wait for the project to be created

2. **Get your project credentials:**
   - Go to Settings > API
   - Copy the "Project URL" and "anon public" key

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Database Setup

Run the database migrations to create all necessary tables:

1. **Apply main schema migration:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20250817182801_sweet_recipe.sql`
   - Click "Run"

2. **Apply locations table migration:**
   - In the SQL Editor, copy and paste the contents of `supabase/migrations/create_locations_table.sql`
   - Click "Run"

### 4. Create Initial Admin User

1. **Go to Authentication > Users in your Supabase dashboard**
2. **Click "Add user"**
3. **Enter admin credentials:**
   - Email: `admin@caftantalia.com`
   - Password: `admin123456` (change this in production!)
   - Confirm email: Yes

4. **Add user profile:**
   - Go to Table Editor > users
   - Click "Insert row"
   - Fill in:
     - `id`: Copy the user ID from the auth.users table
     - `email`: `admin@caftantalia.com`
     - `name`: `System Administrator`
     - `role`: `admin`
   - Click "Save"

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Default Login Credentials

- **Email:** `admin@caftantalia.com`
- **Password:** `admin123456`

**⚠️ Important:** Change these credentials immediately after first login!

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   ├── LoadingStates.tsx
│   ├── Login.tsx
│   └── PasswordReset.tsx
├── hooks/              # Custom React hooks
│   └── useSupabaseQuery.ts
├── i18n/               # Internationalization
│   └── index.ts
├── lib/                # Utilities and configurations
│   ├── monitoring.ts
│   └── supabase.ts
├── pages/              # Main application pages
│   ├── BOM.tsx
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── LogWork.tsx
│   ├── Management.tsx
│   ├── Payroll.tsx
│   └── Reports.tsx
├── stores/             # State management
│   └── authStore.ts
└── App.tsx             # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication & Authorization
- **Role-based access control** (Admin, Supervisor, Worker)
- **Secure authentication** with Supabase Auth
- **Password reset functionality**
- **Session management**

### Core Modules
1. **Dashboard** - Overview and analytics
2. **Work Logging** - Track daily work activities
3. **Inventory Management** - Stock tracking and alerts
4. **Bill of Materials (BOM)** - Product material requirements
5. **Payroll** - Worker payment management
6. **Reports** - Analytics and data export
7. **Management** - User and location administration

### Technical Features
- **Real-time data** with Supabase
- **Responsive design** with Tailwind CSS
- **Internationalization** (Arabic/English)
- **Error tracking** and monitoring
- **Performance optimization**
- **Type safety** with TypeScript

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS for styling
- Implement proper error handling

### Database Operations
- Use the custom hooks in `src/hooks/useSupabaseQuery.ts`
- Always handle loading and error states
- Implement optimistic updates where appropriate

### State Management
- Use Zustand for global state (auth store)
- Use React Query for server state
- Keep component state local when possible

### Internationalization
- Add new translations to `src/i18n/index.ts`
- Use the `useTranslation` hook for text
- Support both RTL (Arabic) and LTR (English) layouts

## Troubleshooting

### Common Issues

**"Invalid login credentials" error:**
- Verify you've created the admin user correctly
- Check that the user exists in both `auth.users` and `users` tables
- Ensure the password is correct

**"Infinite recursion detected in policy" error:**
- This indicates an issue with Row Level Security policies
- Check the RLS policies in your Supabase dashboard
- Ensure policies don't reference themselves

**Build errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run lint`
- Verify all environment variables are set

**Database connection issues:**
- Verify your Supabase URL and key in `.env`
- Check your Supabase project status
- Ensure your IP is not blocked by Supabase

### Getting Help

1. **Check the browser console** for error messages
2. **Review Supabase logs** in the dashboard
3. **Verify database schema** matches the migrations
4. **Test API endpoints** in the Supabase API docs

## Next Steps

After completing the setup:

1. **Explore the application** with the admin account
2. **Create additional users** with different roles
3. **Add sample data** to test all features
4. **Customize the application** for your specific needs
5. **Review the deployment guide** when ready for production

## Contributing

When contributing to the project:

1. Create a feature branch from `main`
2. Make your changes with proper tests
3. Update documentation if needed
4. Submit a pull request with a clear description

## Support

For technical support or questions:
- Review this documentation
- Check the troubleshooting section
- Examine the code comments and examples
- Test in a clean environment to isolate issues