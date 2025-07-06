# 💍 PlanWed - Beautiful Wedding Planner PWA

A minimalist, elegant, and mobile-first Progressive Web App for planning your perfect wedding. Built with modern web technologies for a native app-like experience.

![PlanWed Preview](https://via.placeholder.com/800x400/E11D48/FFFFFF?text=PlanWed+Preview)

## ✨ Features

### 🎯 Core Features
- **📊 Budget Management** - Track wedding expenses with visual progress indicators
- **✅ Task Management** - Organize wedding to-dos with priorities and deadlines
- **👥 Guest Management** - Manage guest list with RSVP tracking
- **📅 Calendar Integration** - Timeline view for important wedding dates
- **📱 PWA Support** - Install as native app on mobile and desktop

### 🎨 Design Philosophy
- **Minimalist & Clean** - Elegant design focused on usability
- **Mobile-First** - Optimized for touch interactions and mobile usage
- **Native Feel** - Smooth animations and haptic feedback simulation
- **Responsive** - Seamless experience across all device sizes

### 🚀 Technical Features
- **Offline Support** - Works without internet connection
- **Real-time Sync** - Powered by Supabase for instant updates
- **Performance Optimized** - Fast loading with minimal bundle size
- **Accessibility** - WCAG compliant with keyboard navigation

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[Lucide Icons](https://lucide.dev/)** - Consistent iconography

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Zustand Persist](https://github.com/roadmanfong/zustand-persist)** - Local storage persistence

### PWA & Performance
- **[Next PWA](https://github.com/shadowwalker/next-pwa)** - Service worker integration
- **[date-fns](https://date-fns.org/)** - Lightweight date utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/planwed-app.git
   cd planwed-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Setup Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Enable Row Level Security on all tables

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 PWA Installation

### Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Tap the "Share" button (iOS) or menu (Android)
3. Select "Add to Home Screen"
4. Confirm installation

### Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the install icon in the address bar
3. Click "Install" in the popup

## 🗄️ Database Schema

The app uses the following main tables:

- **`weddings`** - Wedding project information
- **`budget_categories`** - Budget tracking by category
- **`todos`** - Task management with priorities
- **`guests`** - Guest list with RSVP status
- **`calendar_events`** - Important dates and appointments

All tables include Row Level Security (RLS) policies for data protection.

## 🎨 Design System

### Color Palette
- **Primary**: `#E11D48` (Elegant Rose)
- **Background**: `#FFFFFF` (Pure White)
- **Foreground**: `#1E293B` (Dark Slate)
- **Muted**: `#64748B` (Soft Gray)
- **Success**: `#059669` (Elegant Green)

### Typography
- **Font**: Inter (system fallback)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold)
- **Scale**: Mobile-optimized with clear hierarchy

### Components
- **Cards**: Subtle shadows with rounded corners
- **Buttons**: Touch-friendly with haptic feedback
- **Navigation**: Bottom tabs (mobile) / Sidebar (desktop)

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles & design system
│   ├── layout.tsx         # Root layout with PWA meta
│   └── page.tsx           # Dashboard page
├── components/
│   ├── layout/            # Layout components
│   │   └── app-layout.tsx # Main app layout
│   └── ui/                # Reusable UI components
│       ├── bottom-navigation.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── store.ts           # Zustand state management
│   ├── supabase.ts        # Supabase client & types
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn](https://twitter.com/shadcn) for the amazing UI components
- [Vercel](https://vercel.com) for the deployment platform
- [Supabase](https://supabase.com) for the backend infrastructure
- The open-source community for the incredible tools

---

**Made with ❤️ for couples planning their perfect wedding day**
