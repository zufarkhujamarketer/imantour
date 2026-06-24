import { prisma } from "@imantour/database";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="section-title">Biz bilan bog'laning</h1>
      <p className="mt-2 text-gray-500">Savollaringiz bormi? Biz doim yordam berishga tayyormiz!</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-4 rounded-xl border bg-white p-5">
            <div className="rounded-full bg-brand-100 p-3"><Phone className="h-5 w-5 text-brand-600" /></div>
            <div>
              <h3 className="font-semibold">Telefon</h3>
              <a href={`tel:${settings?.phone}`} className="text-brand-600 hover:underline">{settings?.phone}</a>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border bg-white p-5">
            <div className="rounded-full bg-brand-100 p-3"><Mail className="h-5 w-5 text-brand-600" /></div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <a href={`mailto:${settings?.email}`} className="text-brand-600 hover:underline">{settings?.email}</a>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border bg-white p-5">
            <div className="rounded-full bg-brand-100 p-3"><MapPin className="h-5 w-5 text-brand-600" /></div>
            <div>
              <h3 className="font-semibold">Manzil</h3>
              <p className="text-gray-600">{settings?.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border bg-white p-5">
            <div className="rounded-full bg-brand-100 p-3"><Clock className="h-5 w-5 text-brand-600" /></div>
            <div>
              <h3 className="font-semibold">Ish vaqti</h3>
              <p className="text-gray-600">{settings?.workingHours}</p>
            </div>
          </div>
          <a href={`https://t.me/${settings?.telegram?.replace("@", "")}`} className="btn-primary">
            <Send className="h-4 w-4" /> Telegram orqali yozing
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <iframe
            title="ImanTour lokatsiyasi"
            src={`https://maps.google.com/maps?q=${settings?.mapLat},${settings?.mapLng}&z=15&output=embed`}
            className="h-[400px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
