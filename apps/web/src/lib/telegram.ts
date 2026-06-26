interface BookingNotification {
  bookingId?: string;
  tourTitle: string;
  fullName: string;
  phone: string;
  email?: string;
  people: number;
  date?: string;
  message?: string;
}

export async function sendTelegramNotification(data: BookingNotification) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram sozlamalari topilmadi. TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni .env faylga qo'shing.");
    return;
  }

  const text = [
    "🆕 *YANGI BRON!*",
    "",
    `📦 *Tur:* ${escapeMarkdown(data.tourTitle)}`,
    `👤 *Ism:* ${escapeMarkdown(data.fullName)}`,
    `📞 *Telefon:* ${escapeMarkdown(data.phone)}`,
    data.email ? `📧 *Email:* ${escapeMarkdown(data.email)}` : null,
    `👥 *Kishi soni:* ${data.people}`,
    data.date ? `📅 *Sana:* ${escapeMarkdown(data.date)}` : null,
    data.message ? `💬 *Xabar:* ${escapeMarkdown(data.message)}` : null,
    "",
    "⏳ *HOLAT: KUTILMOQDA*",
    `⏰ ${new Date().toLocaleString("uz-UZ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const reply_markup = data.bookingId
    ? {
        inline_keyboard: [
          [
            { text: "✅ Tasdiqlash", callback_data: `confirm:${data.bookingId}` },
            { text: "❌ Bekor qilish", callback_data: `cancel:${data.bookingId}` },
          ],
        ],
      }
    : undefined;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup,
    }),
  });
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
