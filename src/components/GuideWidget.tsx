import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Heart, Sparkles, Timer, X } from 'lucide-react';

const GUIDE_STEPS = [
  {
    icon: Heart,
    badge: '01 · SANAL DOST SAHNESİ',
    title: 'Dostunla Etkileşime Geç & Özelleştir',
    desc: 'Dostuna dokunarak onu sev, türünü ve adını seç; enerjisini ve ruh halini gün boyu yanında takip et.',
  },
  {
    icon: CheckCircle2,
    badge: '02 · MİKRO ADIMLAR',
    title: 'Küçük Görevlerle Pati Puanı Kazan',
    desc: 'Bir bardak su içmek, 5 dakika esnemek veya masanı toplamak gibi baskısız mikro adımları işaretleyip puan topla.',
  },
  {
    icon: Timer,
    badge: '03 · ODAK & REHBERLİ NEFES',
    title: 'Pomodoro Zamanlayıcı & 4-4-6 Nefes',
    desc: 'Zorlanmadan çalışmak için odak sayacını başlat veya bunaldığında rehberli nefes & topraklama egzersiziyle sakinleş.',
  },
  {
    icon: Sparkles,
    badge: '04 · GARDIROP & GÜNLÜK',
    title: 'Aksesuar Aç & Duygu Notu Bırak',
    desc: 'Biriktirdiğin pati puanlarıyla dostuna yeni aksesuarlar giydir ve günlük ruh halini tek dokunuşla kaydet.',
  },
];

export function GuideWidget() {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('rehber') === '1' || window.location.hash === '#rehber';
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="PatiDost kullanım rehberini aç"
        className="fixed bottom-20 lg:bottom-5 right-4 lg:right-5 z-40 inline-flex items-center gap-2 rounded-full border-2 border-[#2B2118]/15 bg-[#D45D3A] hover:bg-[#BC4E2E] text-white px-4 py-2.5 text-xs font-bold font-display shadow-md cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#D45D3A] focus-visible:ring-offset-2"
      >
        <BookOpen className="w-4 h-4" />
        <span>Rehber</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-guide-title"
        >
          <div
            className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl border-2 border-[#E8DDD0] bg-[#FFF9F2] text-[#2B2118] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E8DDD0] bg-[#F5ece1] bg-[#F5ECE1] px-5 py-4 rounded-t-3xl">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#D45D3A]">
                  PatiDost Oyun &amp; Odak Rehberi
                </div>
                <h2 id="app-guide-title" className="font-display text-xl font-bold">
                  Dostunla Nasıl İlerlersin?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Rehberi kapat"
                className="rounded-full p-1.5 bg-white border border-[#E8DDD0] hover:bg-[#FFF9F2] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D45D3A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {GUIDE_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.badge}
                    className="rounded-2xl border border-[#E8DDD0] bg-white p-3.5 flex items-start gap-3"
                  >
                    <div className="shrink-0 rounded-xl bg-[#FDF0EB] text-[#D45D3A] p-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold tracking-wider text-[#366B51]">
                        {step.badge}
                      </div>
                      <h3 className="font-display text-sm font-bold">{step.title}</h3>
                      <p className="text-xs text-[#6B5849] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-2xl border border-[#CFE3D7] bg-[#EAF3EE] px-3.5 py-2.5 text-[11px] text-[#214B36] font-medium">
                Tüm ilerlemen ve günlük notların yalnızca kendi cihazında saklanır; sağ üstten JSON yedeği alabilirsin.
              </div>
            </div>

            <div className="border-t border-[#E8DDD0] px-5 py-3 flex justify-end bg-[#F5ECE1] rounded-b-3xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-[#D45D3A] hover:bg-[#BC4E2E] text-white px-4 py-2 text-xs font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2B2118]"
              >
                Hadi Başlayalım
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
