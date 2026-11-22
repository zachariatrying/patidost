import { useEffect, useRef, useState } from 'react';
import { Wind, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { playSoftChime } from '../utils/sound';

type BreathTechnique = 'box' | '478';

interface PhaseSpec {
  label: string;
  seconds: number;
  scale: string;
}

const TECHNIQUES: Record<
  BreathTechnique,
  { name: string; subtitle: string; phases: PhaseSpec[] }
> = {
  box: {
    name: 'Kutu Nefesi (4-4-4-4)',
    subtitle: 'Odaklanma ve zihin berraklığı için dengeli ritim',
    phases: [
      { label: 'Nefes Al', seconds: 4, scale: 'scale-115' },
      { label: 'Tut', seconds: 4, scale: 'scale-115' },
      { label: 'Yavaşça Ver', seconds: 4, scale: 'scale-90' },
      { label: 'Dinlen', seconds: 4, scale: 'scale-90' },
    ],
  },
  '478': {
    name: '4-7-8 Sakinleşme Nefesi',
    subtitle: 'Stres ve uyku öncesi sinir sistemini yumuşatır',
    phases: [
      { label: 'Nefes Al', seconds: 4, scale: 'scale-115' },
      { label: 'Tut', seconds: 7, scale: 'scale-115' },
      { label: 'Yavaşça Ver', seconds: 8, scale: 'scale-90' },
    ],
  },
};

interface BreathingWidgetProps {
  petName: string;
  soundEnabled: boolean;
  onCompleteRound: (cycles: number) => void;
}

export function BreathingWidget({
  petName,
  soundEnabled,
  onCompleteRound,
}: BreathingWidgetProps) {
  const [technique, setTechnique] = useState<BreathTechnique>('box');
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secLeft, setSecLeft] = useState(TECHNIQUES.box.phases[0].seconds);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [rewardedThisRound, setRewardedThisRound] = useState(false);

  const phases = TECHNIQUES[technique].phases;
  const phaseRef = useRef(phaseIdx);
  phaseRef.current = phaseIdx;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecLeft((prev) => {
        if (prev > 1) return prev - 1;
        const nextIdx = (phaseRef.current + 1) % phases.length;
        setPhaseIdx(nextIdx);
        playSoftChime('tap', soundEnabled);
        if (nextIdx === 0) {
          setCompletedCycles((c) => {
            const nextC = c + 1;
            if (nextC === 3 && !rewardedThisRound) {
              setRewardedThisRound(true);
              onCompleteRound(3);
            }
            return nextC;
          });
        }
        return phases[nextIdx].seconds;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, phases, soundEnabled, rewardedThisRound, onCompleteRound]);

  const switchTechnique = (next: BreathTechnique) => {
    setRunning(false);
    setTechnique(next);
    setPhaseIdx(0);
    setSecLeft(TECHNIQUES[next].phases[0].seconds);
  };

  const resetSession = () => {
    setRunning(false);
    setPhaseIdx(0);
    setSecLeft(TECHNIQUES[technique].phases[0].seconds);
    setCompletedCycles(0);
    setRewardedThisRound(false);
  };

  const currentPhase = phases[phaseIdx];

  return (
    <section
      aria-label="Rehberli nefes ve topraklama egzersizi"
      className="rounded-3xl border border-[#E8DDD0] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(43,33,24,0.18)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#2B2118] flex items-center gap-2">
            <Wind className="w-5 h-5 text-[#366B51]" />
            Rehberli Nefes & Topraklama
          </h2>
          <p className="text-xs text-[#6B5849] mt-0.5">
            {petName} ile 3 nefes döngüsünü tamamla (+15 XP & +15 pati puanı).
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-[#F5ECE1] p-1">
          {(['box', '478'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTechnique(t)}
              className={`rounded-lg px-3 py-1 text-xs font-bold cursor-pointer transition-colors ${
                technique === t ? 'bg-white text-[#2B2118] shadow-xs' : 'text-[#6B5849]'
              }`}
            >
              {t === 'box' ? '4-4-4-4 Kutu' : '4-7-8 Sakin'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
          <div
            className={`w-28 h-28 rounded-full bg-[#EAF3EE] border-4 border-[#366B51]/40 flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${
              running ? currentPhase.scale : 'scale-100'
            }`}
          >
            <span className="text-2xl font-extrabold text-[#214B36] tabular-nums leading-none">
              {secLeft}s
            </span>
            <span className="text-xs font-bold text-[#366B51] mt-1">{currentPhase.label}</span>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <div className="text-sm font-bold text-[#2B2118]">{TECHNIQUES[technique].name}</div>
            <p className="text-xs text-[#6B5849] mt-0.5">{TECHNIQUES[technique].subtitle}</p>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#366B51] px-4 py-2 text-xs font-bold text-white hover:bg-[#2A5540] transition-colors cursor-pointer"
            >
              {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {running ? 'Duraklat' : 'Nefesi Başlat'}
            </button>

            <button
              type="button"
              onClick={resetSession}
              aria-label="Sıfırla"
              className="rounded-xl border border-[#E8DDD0] bg-[#FFF9F2] p-2 text-[#6B5849] hover:bg-[#F5ECE1] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="ml-1 rounded-full bg-[#F5ECE1] px-3 py-1 text-xs font-bold text-[#6B5849] tabular-nums">
              Döngü: {completedCycles}/3
            </span>
          </div>

          {rewardedThisRound && (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#EAF3EE] border border-[#CFE3D7] px-3 py-1.5 text-xs font-semibold text-[#214B36]">
              <CheckCircle2 className="w-4 h-4" />
              3 döngü tamamlandı! +15 XP ve +15 pati puanı eklendi.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
