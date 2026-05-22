# Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub repository
- MongoDB Atlas cluster
- Cloudinary account
- SMTP provider (Gmail, SendGrid, Resend, etc.)

### Steps

1. **Push code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Framework preset: Next.js

3. **Environment Variables** (Settings → Environment Variables)

```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-secure-secret>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
ADMIN_EMAIL=...
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=...
```

4. **Deploy** — Vercel auto-builds on push

5. **Seed production DB** (run locally pointing to Atlas):
```bash
MONGODB_URI="your-atlas-uri" npm run seed
```

6. **Change admin password** immediately after first login

## Docker (Optional)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

## Performance Tips

- Enable Vercel Analytics
- Use MongoDB indexes (already defined in models)
- Configure Cloudinary auto-format and quality
- Set `images.remotePatterns` in `next.config.ts` for your domains

## Security

- Never commit `.env.local`
- Rotate `NEXTAUTH_SECRET` periodically
- Restrict MongoDB Atlas IP to Vercel IPs or `0.0.0.0/0` with strong password
- Use app-specific SMTP passwords
- Enable rate limiting env vars for production traffic
