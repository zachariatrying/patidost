import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Timer } from 'lucide-react';
import type { FocusLog } from '../types';

interface FocusPomodoroProps {
  petName: string;
  focusLogs: FocusLog[];
  onStatusChange: (isFocusing: boolean) => void;
  onCompleteSession: (minutes: number, label: string, coins: number) => void;
}

const PRESETS = [
  { minutes: 15, label: 'Hızlı Toparlanma', coins: 20 },
  { minutes: 25, label: 'Klasik Pomodoro', coins: 35 },
  { minutes: 50, label: 'Derin YKS / İş Bloğu', coins: 65 },
];

export function FocusPomodoro({
  petName,
  focusLogs,
  onStatusChange,
  onCompleteSession,
}: FocusPomodoroProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionLabel, setSessionLabel] = useState('Matematik / Derin Çalışma');

  useEffect(() => {
    onStatusChange(running);
  }, [running, onStatusChange]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          const preset = PRESETS.find((p) => p.minutes === selectedMinutes);
          const coins = preset ? preset.coins : Math.max(15, Math.round(selectedMinutes * 1.4));
          onCompleteSession(selectedMinutes, sessionLabel.trim() || 'Odaklanma Seansı', coins);
          return selectedMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, selectedMinutes, sessionLabel, onCompleteSession]);

  const handleSelectPreset = (minutes: number) => {
    setRunning(false);
    setSelectedMinutes(minutes);
    setSecondsLeft(minutes * 60);
  };

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  };

  const handleCompleteNow = () => {
    const elapsedMinutes = Math.max(1, Math.round((selectedMinutes * 60 - secondsLeft) / 60));
    const creditedMinutes = elapsedMinutes >= 5 ? elapsedMinutes : selectedMinutes;
    const coins = Math.max(15, Math.round(creditedMinutes * 1.2));
    setRunning(false);
    setSecondsLeft(selectedMinutes * 60);
    onCompleteSession(creditedMinutes, sessionLabel.trim() || 'Odaklanma Seansı', coins);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const totalSeconds = selectedMinutes * 60;
  const elapsedPct = Math.round(((totalSeconds - secondsLeft) / Math.max(1, totalSeconds)) * 100);
  const totalMinutesLogged = focusLogs.reduce((acc, log) => acc + log.minutes, 0);

  return (
    <section
      aria-label="Odaklanma Pomodoro Odası"
      className="rounded-3xl border border-[#E8DDD0] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(43,33,24,0.18)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#2B2118] flex items-center gap-2">
            <Timer className="w-5 h-5 text-[#366B51]" />
            Odaklanma Odası
          </h2>
          <p className="text-xs text-[#6B5849] mt-0.5">
            Süre başladığında {petName} de gözlüğünü takıp seninle masada çalışır.
          </p>
        </div>
        <span className="rounded-full bg-[#EAF3EE] px-3 py-1 text-xs font-semibold tabular-nums text-[#366B51]">
          Toplam {totalMinutesLogged} dk
        </span>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {PRESETS.map((preset) => {
          const active = selectedMinutes === preset.minutes;
          return (
            <button
              key={preset.minutes}
              type="button"
              onClick={() => handleSelectPreset(preset.minutes)}
              className={`rounded-2xl border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                active
                  ? 'border-[#366B51] bg-[#EAF3EE] text-[#1E4431]'
                  : 'border-[#E8DDD0] bg-[#FFF9F2] text-[#2B2118] hover:border-[#CBBBA9]'
              }`}
            >
              <div className="text-sm font-bold tabular-nums">{preset.minutes} dk</div>
              <div className="text-[11px] text-[#6B5849] truncate">{preset.label}</div>
            </button>
          );
        })}
      </div>

      {/* Session Label */}
      <div className="mb-4">
        <label htmlFor="focus-topic" className="block text-xs font-semibold text-[#6B5849] mb-1">
          Şu an neye odaklanıyorsun?
        </label>
        <input
          id="focus-topic"
          type="text"
          value={sessionLabel}
          onChange={(e) => setSessionLabel(e.target.value)}
          className="w-full rounded-xl border border-[#E2D6C8] bg-[#FFF9F2] px-3.5 py-2 text-sm text-[#2B2118] focus:border-[#366B51] focus:bg-white focus:outline-none"
        />
      </div>

      {/* Big Digital Readout */}
      <div className="rounded-2xl bg-[#FFF9F2] border border-[#EDE3D7] p-5 text-center">
        <div className="font-display text-5xl font-bold tracking-tight tabular-nums text-[#2B2118]">
          {mins}:{secs}
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-[#EAE0D4] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#366B51] transition-all duration-500"
            style={{ width: `${elapsedPct}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setRunning((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer ${
              running ? 'bg-[#B7791F] hover:bg-[#9C6518]' : 'bg-[#366B51] hover:bg-[#2A5741]'
            }`}
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? 'Duraklat' : 'Seansı Başlat'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2D6C8] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#6B5849] hover:bg-[#F5ECE1] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </button>

          <button
            type="button"
            onClick={handleCompleteNow}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCEAE2] bg-[#EAF3EE] px-3.5 py-2.5 text-xs font-semibold text-[#366B51] hover:bg-[#DCECE3] transition-colors cursor-pointer"
            title="Seansı şimdi tamamlandı say ve ödülünü al"
          >
            <CheckCircle2 className="w-4 h-4" />
            Bitirdim
          </button>
        </div>
      </div>

      {/* Recent Focus Logs */}
      {focusLogs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#F1E8DD]">
          <h3 className="text-xs font-semibold text-[#6B5849] mb-2">Son Odaklanma Seansların</h3>
          <ul className="space-y-1.5">
            {focusLogs.slice(0, 3).map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between text-xs rounded-xl bg-[#FFFDF9] border border-[#F0E6DA] px-3 py-2"
              >
                <span className="font-medium text-[#2B2118] truncate pr-2">{log.label}</span>
                <span className="shrink-0 tabular-nums text-[#366B51] font-semibold">
                  {log.minutes} dk · +{log.coinsEarned} pati
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
