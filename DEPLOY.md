# Vercel deploy — ImanTour

## 1. GitHub ga yuklash

```bash
cd C:\Users\Zufarkhuja\Projects\imantour
git add .
git commit -m "Vercel deploy tayyor"
git remote add origin https://github.com/SIZNING-USERNAME/imantour.git
git push -u origin main
```

## 2. Neon PostgreSQL (bepul)

1. [neon.tech](https://neon.tech) da ro'yxatdan o'ting
2. Yangi project yarating (masalan: `imantour`)
3. **Connection string** ni nusxalang (`postgresql://...`)

## 3. Vercel — Web sayt (imantour.uz)

1. [vercel.com](https://vercel.com) → **Add New Project**
2. GitHub repozitoriyani tanlang
3. Sozlamalar:

| Sozlama | Qiymat |
|---------|--------|
| **Root Directory** | `apps/web` |
| **Framework** | Next.js |

4. **Environment Variables** qo'shing:

| O'zgaruvchi | Qiymat |
|-------------|--------|
| `DATABASE_URL` | Neon connection string |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token |
| `TELEGRAM_CHAT_ID` | Telegram chat ID |
| `JWT_SECRET` | Tasodifiy uzun matn (masalan: `openssl rand -hex 32`) |

5. **Deploy** bosing
6. **Settings → Domains** → `imantour.uz` ulang

## 4. Vercel — Admin panel (admin.imantour.uz)

Yana **Add New Project** (xuddi repo, lekin boshqa sozlamalar):

| Sozlama | Qiymat |
|---------|--------|
| **Root Directory** | `apps/admin` |

**Environment Variables:**

| O'zgaruvchi | Qiymat |
|-------------|--------|
| `DATABASE_URL` | Xuddi shu Neon string |
| `JWT_SECRET` | Web bilan bir xil qiymat |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (quyida) |

**Domen:** `admin.imantour.uz`

## 5. Vercel Blob (rasm/video yuklash)

Admin panelda fayl yuklash uchun:

1. Vercel admin project → **Storage** → **Create Blob Store**
2. Blob store ni admin project ga ulang
3. `BLOB_READ_WRITE_TOKEN` avtomatik qo'shiladi

## 6. Bazani to'ldirish (birinchi marta)

Deploy dan keyin mahalliy kompyuterdan:

```bash
cd C:\Users\Zufarkhuja\Projects\imantour
# Neon DATABASE_URL ni vaqtincha .env ga qo'ying
npm run db:push
npm run db:seed
```

Bu admin, kategoriyalar va namuna turlarni yaratadi.

## Admin kirish

| | |
|---|---|
| **Login** | `admin1` |
| **Parol** | `imantour` |

## DNS sozlash (imantour.uz)

Domen provayderingizda:

```
imantour.uz       → CNAME → cname.vercel-dns.com
admin.imantour.uz → CNAME → cname.vercel-dns.com
```

Har bir subdomain uchun Vercel projectda tegishli domenni qo'shing.

## Muammolar

**Build xatosi (Prisma):** `DATABASE_URL` Vercel env da to'g'ri ekanligini tekshiring.

**Rasm yuklanmaydi:** Admin projectda `BLOB_READ_WRITE_TOKEN` borligini tekshiring.

**Login ishlamaydi:** `npm run db:seed` ni production DATABASE_URL bilan ishga tushiring.
