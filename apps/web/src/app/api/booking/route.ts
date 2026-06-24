import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@imantour/database";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tourId, fullName, phone, email, people, date, message } = body;

    if (!tourId || !fullName || !phone) {
      return NextResponse.json({ error: "Majburiy maydonlar to'ldirilmagan" }, { status: 400 });
    }

    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      return NextResponse.json({ error: "Tur topilmadi" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: { tourId, fullName, phone, email, people: people || 1, date, message },
    });

    await sendTelegramNotification({
      tourTitle: tour.title,
      fullName,
      phone,
      email,
      people: people || 1,
      date,
      message,
    });

    return NextResponse.json({ success: true, id: booking.id });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
