import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("imantour", 10);

  await prisma.admin.upsert({
    where: { email: "admin1" },
    update: { password },
    create: {
      email: "admin1",
      password,
      name: "Admin",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {},
  });

  const categories = [
    { name: "Ichki turlar", slug: "ichki-turlar", description: "O'zbekiston bo'ylab sayohatlar", order: 1 },
    { name: "Xalqaro turlar", slug: "xalqaro-turlar", description: "Dunyo bo'ylab sayohatlar", order: 2 },
    { name: "Pilgrim turlar", slug: "pilgrim-turlar", description: "Ziyorat va ruhaniy sayohatlar", order: 3 },
    { name: "Ekoturizm", slug: "ekoturizm", description: "Tabiat va ekologik sayohatlar", order: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const ichki = await prisma.category.findUnique({ where: { slug: "ichki-turlar" } });
  const xalqaro = await prisma.category.findUnique({ where: { slug: "xalqaro-turlar" } });

  if (ichki) {
    await prisma.tour.upsert({
      where: { slug: "samarqand-buxoro" },
      update: {},
      create: {
        title: "Samarqand — Buxoro klassik safari",
        slug: "samarqand-buxoro",
        description: "Ikki buyuk shahar — Registon, Bibi-Xonim, Po-i-Kalon va Ark qal'asi. Professional gid hamrohligida 4 kunlik sayohat.",
        shortDesc: "4 kunlik klassik O'zbekiston safari",
        price: 2500000,
        duration: "4 kun / 3 kecha",
        destination: "Samarqand, Buxoro",
        featured: true,
        categoryId: ichki.id,
        includes: JSON.stringify(["Transport", "Mehmonxona", "Nonushta", "Gid xizmati"]),
        itinerary: JSON.stringify([
          { day: 1, title: "Toshkent — Samarqand", desc: "Registon maydoni va Shohi-Zinda" },
          { day: 2, title: "Samarqand", desc: "Bibi-Xonim va Ulug'bek rasadxonasi" },
          { day: 3, title: "Buxoroga yo'l", desc: "Po-i-Kalon va Lyabi-Hauz" },
          { day: 4, title: "Buxoro — Toshkent", desc: "Ark qal'asi va bozorlar" },
        ]),
      },
    });
  }

  if (xalqaro) {
    await prisma.tour.upsert({
      where: { slug: "dubay-luks" },
      update: {},
      create: {
        title: "Dubay — Luks dam olish",
        slug: "dubay-luks",
        description: "Burj Khalifa, cho'l safari, Marina va dunyoning eng zamonaviy shahri. 5 kunlik premium sayohat.",
        shortDesc: "5 kunlik Dubay premium tur",
        price: 8500000,
        duration: "5 kun / 4 kecha",
        destination: "Dubay, BAA",
        featured: true,
        categoryId: xalqaro.id,
        includes: JSON.stringify(["Aviabiletlar", "4★ mehmonxona", "Transfer", "Cho'l safari"]),
      },
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "samarqandga-borish-uchun-5-sabab" },
    update: {},
    create: {
      title: "Samarqandga borish uchun 5 sabab",
      slug: "samarqandga-borish-uchun-5-sabab",
      excerpt: "Nega Samarqand dunyoning eng qadimiy va go'zal shaharlaridan biri?",
      content: `<p>Samarqand — Buyuk Ipak yo'lining yuragi. Bu shahar 2500 yillik tarixga ega va UNESCO merosi ro'yxatida.</p>
<h2>1. Registon maydoni</h2><p>Dunyodagi eng chiroyli maydonlardan biri — kunduzi va kechasi ajoyib ko'rinishga ega.</p>
<h2>2. Shohi-Zinda majmuasi</h2><p>Ko'k va oq koshinlar bilan bezatilgan masjidlar qatori.</p>
<h2>3. Milliy taomlar</h2><p>Plov, somsa va non — Samarqand oshxonasi o'ziga xos.</p>`,
      published: true,
    },
  });

  console.log("Seed muvaffaqiyatli yakunlandi!");
  console.log("Admin: admin1 / imantour");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
