# ImanTour — Sayohat agentligi veb-sayti

ImanTour tur agentligi uchun to'liq veb-platforma: ochiq sayt, admin panel va Telegram bot integratsiyasi.

## Tuzilma

```
imantour/
├── apps/
│   ├── web/          → imantour.uz (port 3000)
│   └── admin/        → admin.imantour.uz (port 3001)
├── packages/
│   ├── database/     → Prisma + SQLite/PostgreSQL
│   └── shared/       → Umumiy utilitalar
└── uploads/          → Yuklangan rasmlar va videolar
```

## Imkoniyatlar

### Ochiq sayt (imantour.uz)
- Tur katalogi va kategoriyalar bo'yicha filtrlash
- Tur paket sahifasi (rasm, video, dastur, bron formasi)
- Sayohat blogi
- Aloqa ma'lumotlari va Google xarita
- Bron qilganda Telegram botga xabar yuborish

### Admin panel (admin.imantour.uz)
- Tur paket qo'shish / tahrirlash / o'chirish
- Kategoriyalar CRUD
- Rasm va video yuklash (telefon yoki kompyuter)
- Blog boshqaruvi
- Bronlarni ko'rish va holatini o'zgartirish
- Aloqa sozlamalari

## O'rnatish

```bash
cd C:\Users\Zufarkhuja\Projects\imantour
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

## Ishga tushirish

```bash
# Ochiq sayt
npm run dev:web     # http://localhost:3000

# Admin panel (boshqa terminalda)
npm run dev:admin   # http://localhost:3001
```

**Admin kirish:** `admin1` / `imantour`

## Vercel deploy

Batafsil qo'llanma: [DEPLOY.md](./DEPLOY.md)

1. [@BotFather](https://t.me/BotFather) da yangi bot yarating
2. Bot tokenini oling
3. Botga `/start` yuboring va chat ID ni oling ([@userinfobot](https://t.me/userinfobot) yordamida)
4. `apps/web/.env` faylga qo'shing:

```env
TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
TELEGRAM_CHAT_ID="123456789"
```

## Production deploy

### Domenlar
- `imantour.uz` → `apps/web`
- `admin.imantour.uz` → `apps/admin`

### PostgreSQL (production uchun)
`packages/database/prisma/schema.prisma` da `provider` ni `postgresql` ga o'zgartiring va `DATABASE_URL` ni production serverga ulang.

### Tavsiya etilgan hosting
- **Vercel** — har ikkala app uchun alohida project
- **VPS** — Nginx reverse proxy bilan ikkala domen

### Nginx misoli
```nginx
server {
    server_name imantour.uz;
    location / { proxy_pass http://localhost:3000; }
}

server {
    server_name admin.imantour.uz;
    location / { proxy_pass http://localhost:3001; }
}
```

## Texnologiyalar

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- Telegram Bot API
- JWT autentifikatsiya (admin)
