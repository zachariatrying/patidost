import { useState, type FormEvent } from 'react';
import { BookHeart, Download } from 'lucide-react';
import type { MoodEntry, MoodLevel } from '../types';
import { MOOD_OPTIONS } from '../data/catalog';

interface MoodJournalProps {
  entries: MoodEntry[];
  onSaveMood: (level: MoodLevel, note: string) => void;
  onExportBackup: () => void;
}

export function MoodJournal({ entries, onSaveMood, onExportBackup }: MoodJournalProps) {
  const [selected, setSelected] = useState<MoodLevel>('sakin');
  const [note, setNote] = useState('');
  const [justSavedReply, setJustSavedReply] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const opt = MOOD_OPTIONS.find((o) => o.level === selected);
    onSaveMood(selected, note.trim());
    setNote('');
    setJustSavedReply(opt ? opt.reply : 'Kaydedildi!');
  };

  return (
    <section
      aria-label="10 saniyelik ruh hali günlüğü"
      className="rounded-3xl border border-[#E8DDD0] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(43,33,24,0.18)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#2B2118] flex items-center gap-2">
            <BookHeart className="w-5 h-5 text-[#D45D3A]" />
            10 Saniyelik Hâl Hatır
          </h2>
          <p className="text-xs text-[#6B5849] mt-0.5">
            Şu an nasıl hissediyorsun? Kayıt +15 pati puanı kazandırır, tamamen cihazında kalır.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportBackup}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-[#FFF9F2] px-3 py-1.5 text-xs font-semibold text-[#6B5849] hover:bg-[#F5ECE1] transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          JSON Yedek
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-5 gap-1.5">
          {MOOD_OPTIONS.map((opt) => {
            const active = selected === opt.level;
            return (
              <button
                key={opt.level}
                type="button"
                onClick={() => setSelected(opt.level)}
                className="rounded-2xl border px-2 py-2.5 text-center text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: active ? opt.bg : '#FFFDF9',
                  borderColor: active ? opt.color : '#E8DDD0',
                  color: active ? opt.color : '#6B5849',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="İstersen tek cümle not bırak (isteğe bağlı)..."
            className="flex-1 rounded-xl border border-[#E2D6C8] bg-[#FFF9F2] px-3.5 py-2.5 text-sm text-[#2B2118] placeholder:text-[#8C7766] focus:border-[#D45D3A] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#2B2118] px-4 py-2.5 text-sm font-semibold text-[#FFF9F2] hover:bg-[#3F3124] transition-colors cursor-pointer"
          >
            Kaydet
          </button>
        </div>
      </form>

      {justSavedReply && (
        <div className="mt-3 rounded-2xl bg-[#EAF3EE] border border-[#CFE3D7] px-4 py-2.5 text-xs font-medium text-[#214B36]">
          {justSavedReply}
        </div>
      )}

      {entries.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#F1E8DD]">
          <h3 className="text-xs font-semibold text-[#6B5849] mb-2">Son Kayıtların</h3>
          <ul className="space-y-2">
            {entries.slice(0, 4).map((entry) => {
              const opt = MOOD_OPTIONS.find((o) => o.level === entry.level);
              const dateStr = new Date(entry.dateIso).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <li
                  key={entry.id}
                  className="rounded-xl border border-[#EFE5D9] bg-[#FFFDF9] px-3.5 py-2.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="inline-flex rounded-full px-2 py-0.5 font-semibold"
                      style={{
                        backgroundColor: opt?.bg ?? '#F5ECE1',
                        color: opt?.color ?? '#2B2118',
                      }}
                    >
                      {opt?.label ?? entry.level}
                    </span>
                    <span className="text-[#8C7766] tabular-nums">{dateStr}</span>
                  </div>
                  {entry.note && <p className="mt-1.5 text-[#2B2118]">{entry.note}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
