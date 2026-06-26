import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN sozlanmagan" }, { status: 500 });
  }

  // Get current host URL (e.g. https://imantour.uz)
  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const webhookUrl = `${protocol}://${host}/api/telegram/webhook`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
    );
    const result = await response.json();

    if (!response.ok || !result.ok) {
      return NextResponse.json({ error: result.description || "Telegram xatosi" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Webhook muvaffaqiyatli ulandi!",
      webhookUrl,
      telegramResponse: result,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server xatosi" }, { status: 500 });
  }
}
