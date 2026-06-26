import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@imantour/database";

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Token not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();

    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const data = (callbackQuery.data || "") as string;
      const chatId = callbackQuery.message?.chat?.id;
      const messageId = callbackQuery.message?.message_id;
      const text = callbackQuery.message?.text || "";

      const [action, bookingId] = data.split(":");

      if (bookingId && (action === "confirm" || action === "cancel")) {
        const newStatus = action === "confirm" ? "confirmed" : "cancelled";
        const statusLabel = action === "confirm" ? "✅ *HOLAT: TASDIQLANDI*" : "❌ *HOLAT: BEKOR QILINDI*";

        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: newStatus },
        }).catch((err) => console.error("Database update error in webhook:", err));

        await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: action === "confirm" ? "Bron tasdiqlandi!" : "Bron bekor qilindi!",
          }),
        });

        if (chatId && messageId) {
          const updatedText = text.includes("HOLAT: KUTILMOQDA")
            ? text.replace(/⏳ \*HOLAT: KUTILMOQDA\*/g, statusLabel)
            : `${text}\n\n${statusLabel}`;

          await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: updatedText,
              parse_mode: "Markdown",
            }),
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
