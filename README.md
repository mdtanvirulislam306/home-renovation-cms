# GreenScape Pro — Landscaping & Property Services CMS

Production-ready Next.js 15 full-stack application with public marketing website and admin dashboard.

## Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Framer Motion
- **Database:** MongoDB + Mongoose
- **Auth:** NextAuth (Credentials + JWT)
- **Media:** Cloudinary
- **Forms:** React Hook Form + Zod
- **State:** Zustand, TanStack Query
- **Editor:** TipTap
- **Charts:** Recharts
- **Email:** Nodemailer

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Required:
- `MONGODB_URI`
- `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
- `NEXTAUTH_URL` (e.g. `http://localhost:3000`)
- Cloudinary credentials (for image uploads)
- SMTP credentials (for contact form emails)

### 3. Seed the database

```bash
npm run seed
```

Default admin login:
- **Email:** `admin@greenscape.com`
- **Password:** `admin123`

### 4. Run development server

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Marketing pages
│   ├── admin/
│   │   ├── login/
│   │   └── (dashboard)/   # Protected admin routes
│   └── api/               # REST API routes
├── components/
│   ├── ui/                # shadcn components
│   ├── shared/            # Navbar, Footer, etc.
│   ├── sections/          # Homepage sections
│   └── admin/             # Admin components
├── lib/                   # Utilities, DB, auth, SEO
├── models/                # Mongoose schemas
├── validations/           # Zod schemas
├── hooks/
├── providers/
└── config/
```

## Public Pages

| Page | Route |
|------|-------|
| Home | `/` |
| Services | `/services` |
| Service Detail | `/services/[slug]` |
| About | `/about` |
| Blog | `/blog` |
| Blog Post | `/blog/[slug]` |
| Gallery | `/gallery` |
| Contact | `/contact` |
| Case Studies | `/case-studies` |
| Case Study | `/case-studies/[slug]` |

## Admin Features

- Dashboard with analytics & charts
- CRUD: Services, Blogs, Categories, Gallery, Case Studies, Testimonials
- Inquiry management
- Site settings (SEO, business info, analytics)
- Image upload (Cloudinary)
- Rich text editor (TipTap)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Deploy

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get connection string → set `MONGODB_URI`

### Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, API Secret to `.env.local`

## Production Checklist

- [ ] Change default admin password
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure production `NEXTAUTH_URL`
- [ ] Set up MongoDB Atlas with IP whitelist
- [ ] Configure SMTP for production email
- [ ] Add real Cloudinary uploads
- [ ] Update Google Maps embed URL
- [ ] Add Google Analytics ID in settings

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with sample data |
| `npm run lint` | Run ESLint |

## License

Private — All rights reserved.
