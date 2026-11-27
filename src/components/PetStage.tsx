import { useEffect, useState } from 'react';
import { Heart, Sparkles, SlidersHorizontal, Moon, Star, Utensils, Sun } from 'lucide-react';
import type { PetMood, PetSpecies, RoomId } from '../types';
import { getGrowthStage } from '../data/catalog';

interface PetStageProps {
  petName: string;
  species: PetSpecies;
  mood: PetMood;
  xp: number;
  coins: number;
  todayEnergy: number;
  energyGoal: number;
  room: RoomId;
  equipped: {
    head: string | null;
    neck: string | null;
    desk: string | null;
  };
  quote: string;
  restDayActive: boolean;
  onPetClick: () => void;
  onFeedPet: () => void;
  onStarCatch: () => void;
  onCycleRoom: () => void;
  onOpenCustomize: () => void;
  onOpenWardrobe: () => void;
  onToggleRestDay: () => void;
}

export function PetStage({
  petName,
  species,
  mood,
  xp,
  coins,
  todayEnergy,
  energyGoal,
  room,
  equipped,
  quote,
  restDayActive,
  onPetClick,
  onFeedPet,
  onStarCatch,
  onCycleRoom,
  onOpenCustomize,
  onOpenWardrobe,
  onToggleRestDay,
}: PetStageProps) {
  const [hearts, setHearts] = useState<number[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameSeconds, setGameSeconds] = useState(15);
  const [gameScore, setGameScore] = useState(0);
  const [starPos, setStarPos] = useState<{ x: number; y: number }>({ x: 50, y: 42 });

  const { stage, level, progressPct } = getGrowthStage(xp);
  const energyPct = Math.min(100, Math.round((todayEnergy / Math.max(1, energyGoal)) * 100));

  useEffect(() => {
    if (!gameActive) return;
    if (gameSeconds <= 0) {
      setGameActive(false);
      return;
    }
    const timer = window.setTimeout(() => setGameSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [gameActive, gameSeconds]);

  const startStarGame = () => {
    setGameScore(0);
    setGameSeconds(15);
    setStarPos({ x: 25 + Math.random() * 50, y: 25 + Math.random() * 45 });
    setGameActive(true);
  };

  const catchStar = () => {
    setGameScore((s) => s + 1);
    setStarPos({ x: 18 + Math.random() * 64, y: 20 + Math.random() * 52 });
    onStarCatch();
  };

  const handlePet = () => {
    const id = Date.now() + Math.random();
    setHearts((prev) => [...prev.slice(-4), id]);
    onPetClick();
    window.setTimeout(() => {
      setHearts((prev) => prev.filter((item) => item !== id));
    }, 1250);
  };

  const roomBgMap: Record<RoomId, { sky: string; wall: string; floor: string; label: string }> = {
    kadikoy: { sky: '#FDE8CD', wall: '#FDF3E6', floor: '#EBD7BE', label: 'Kadıköy Balkonu' },
    desk: { sky: '#E5ECF4', wall: '#F5EFE6', floor: '#DFCBB2', label: 'Çalışma Odası' },
    rainy: { sky: '#CBD7E3', wall: '#EBE7E1', floor: '#D5CBBF', label: 'Yağmurlu Pencere' },
    garden: { sky: '#DFF1F6', wall: '#EAF4E4', floor: '#CFE2C2', label: 'Bahçe Pikniği' },
    bosphorus: { sky: '#CFE9F7', wall: '#F5EFE6', floor: '#DFCBB2', label: 'Boğaz Kıyısı' },
    night_sky: { sky: '#1E293B', wall: '#2B213A', floor: '#46374E', label: 'Yıldızlı Balkon' },
  };

  const palette = roomBgMap[room];

  return (
    <section
      aria-label="Dijital dost sahnesi"
      className="rounded-3xl border border-[#E8DDD0] bg-white shadow-[0_10px_30px_-18px_rgba(43,33,24,0.22)] overflow-hidden"
    >
      {/* Top Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 pb-3 border-b border-[#F1E8DD]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#2B2118]">{petName}</h1>
            <span className="inline-flex items-center rounded-full bg-[#F5ECE1] px-2.5 py-0.5 text-xs font-semibold text-[#6B5849]">
              Sv. {level} · {stage.name}
            </span>
          </div>
          <p className="text-xs text-[#6B5849] mt-0.5">{palette.label}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleRestDay}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              restDayActive
                ? 'bg-[#366B51] text-white'
                : 'bg-[#F5ECE1] text-[#6B5849] hover:bg-[#EBDDCD]'
            }`}
            title="Seri bozulmadan bugün dinlenme moduna geç"
          >
            <Moon className="w-3.5 h-3.5" />
            {restDayActive ? 'Dinlenme Modu' : 'Dinlen'}
          </button>
          <button
            type="button"
            onClick={onOpenCustomize}
            className="inline-flex items-center justify-center rounded-full bg-[#F5ECE1] p-2 text-[#6B5849] hover:bg-[#EBDDCD] transition-colors cursor-pointer"
            aria-label="Dostunu düzenle"
            title="İsim ve tür değiştir"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Illustrated Stage */}
      <div className="relative px-4 pt-3 pb-2">
        <button
          type="button"
          onClick={handlePet}
          aria-label={`${petName} karakterini okşa`}
          className="group relative block w-full rounded-2xl overflow-hidden border border-[#ECE1D4] focus-visible:ring-2 focus-visible:ring-[#D45D3A] cursor-pointer text-left"
        >
          <svg
            viewBox="0 0 360 250"
            className="w-full h-auto block select-none"
            role="img"
            aria-label={`${petName} odasında`}
          >
            {/* Room Wall */}
            <rect x="0" y="0" width="360" height="250" fill={palette.wall} />

            {/* Window / Outdoor Backdrop */}
            {room === 'garden' ? (
              <>
                <rect x="0" y="0" width="360" height="165" fill={palette.sky} />
                <circle cx="298" cy="48" r="24" fill="#F9D57E" />
                <path d="M0 155 Q95 110 190 148 Q285 118 360 145 L360 190 L0 190 Z" fill="#A6C996" />
                <rect x="0" y="176" width="360" height="74" fill={palette.floor} />
              </>
            ) : (
              <>
                {/* Window Frame */}
                <rect
                  x="208"
                  y="24"
                  width="120"
                  height="112"
                  rx="14"
                  fill={palette.sky}
                  stroke="#D9C8B6"
                  strokeWidth="5"
                />
                {room === 'kadikoy' && (
                  <>
                    <circle cx="292" cy="56" r="16" fill="#F7BE6D" opacity="0.9" />
                    <path d="M210 118 Q250 96 290 112 Q312 104 326 114 L326 134 L210 134 Z" fill="#E39B6D" opacity="0.55" />
                    <path d="M236 105 L242 94 L248 105" stroke="#C97B53" strokeWidth="2" fill="none" />
                  </>
                )}
                {room === 'desk' && (
                  <>
                    <rect x="28" y="42" width="112" height="10" rx="4" fill="#C9B097" />
                    <rect x="40" y="18" width="14" height="24" rx="2" fill="#D45D3A" />
                    <rect x="57" y="22" width="12" height="20" rx="2" fill="#366B51" />
                    <rect x="72" y="15" width="15" height="27" rx="2" fill="#C88A2B" />
                    <rect x="91" y="24" width="32" height="18" rx="3" fill="#FFFFFF" stroke="#D9C8B6" strokeWidth="1.5" />
                  </>
                )}
                {room === 'rainy' && (
                  <>
                    <g stroke="#7A94AE" strokeWidth="2" strokeLinecap="round" className="animate-rain">
                      <line x1="232" y1="42" x2="226" y2="56" />
                      <line x1="262" y1="54" x2="256" y2="68" />
                      <line x1="292" y1="38" x2="286" y2="52" />
                      <line x1="308" y1="70" x2="302" y2="84" />
                      <line x1="246" y1="84" x2="240" y2="98" />
                    </g>
                  </>
                )}
                {room === 'bosphorus' && (
                  <>
                    <path d="M210 112 Q240 105 268 112 Q296 119 326 112 L326 134 L210 134 Z" fill="#60A5FA" opacity="0.6" />
                    <path d="M222 108 L242 84 L294 84 L314 108" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
                    <line x1="242" y1="78" x2="242" y2="112" stroke="#64748B" strokeWidth="3" />
                    <line x1="294" y1="78" x2="294" y2="112" stroke="#64748B" strokeWidth="3" />
                  </>
                )}
                {room === 'night_sky' && (
                  <>
                    <circle cx="298" cy="54" r="13" fill="#FDE68A" />
                    <circle cx="304" cy="50" r="11" fill="#1E293B" />
                    <circle cx="232" cy="46" r="2" fill="#FEF9C3" />
                    <circle cx="256" cy="64" r="1.8" fill="#FEF9C3" />
                    <circle cx="274" cy="42" r="2.2" fill="#FEF9C3" />
                    <circle cx="244" cy="96" r="1.5" fill="#FEF9C3" />
                  </>
                )}
                <line x1="268" y1="24" x2="268" y2="136" stroke="#D9C8B6" strokeWidth="3.5" />
                <line x1="208" y1="80" x2="328" y2="80" stroke="#D9C8B6" strokeWidth="3.5" />

                {/* Cozy Floor & Rug */}
                <rect x="0" y="176" width="360" height="74" fill={palette.floor} />
                <ellipse cx="165" cy="206" rx="112" ry="22" fill="#FFF9F2" stroke="#DECBB7" strokeWidth="2" />
              </>
            )}

            {/* Desk Props on the Right Side */}
            {equipped.desk === 'tea' && (
              <g transform="translate(262, 162)">
                <ellipse cx="22" cy="40" rx="18" ry="5" fill="#D45D3A" opacity="0.25" />
                <path d="M12 16 Q16 26 12 38 Q22 42 32 38 Q28 26 32 16 Z" fill="#C94B2B" opacity="0.88" stroke="#2B2118" strokeWidth="2" />
                <ellipse cx="22" cy="16" rx="10" ry="3" fill="#F2E2D0" stroke="#2B2118" strokeWidth="1.8" />
                <path d="M18 10 Q16 5 19 1" fill="none" stroke="#8C7766" strokeWidth="1.6" strokeLinecap="round" className="animate-steam" />
                <path d="M25 11 Q27 6 24 2" fill="none" stroke="#8C7766" strokeWidth="1.6" strokeLinecap="round" className="animate-steam" />
              </g>
            )}

            {equipped.desk === 'plant' && (
              <g transform="translate(260, 154)">
                <path d="M12 28 L34 28 L30 48 L16 48 Z" fill="#D47451" stroke="#2B2118" strokeWidth="2" strokeLinejoin="round" />
                <ellipse cx="23" cy="24" rx="8" ry="12" fill="#4F8A6B" stroke="#2B2118" strokeWidth="2" />
                <ellipse cx="14" cy="26" rx="6" ry="9" transform="rotate(-24 14 26)" fill="#366B51" stroke="#2B2118" strokeWidth="2" />
                <ellipse cx="32" cy="26" rx="6" ry="9" transform="rotate(24 32 26)" fill="#366B51" stroke="#2B2118" strokeWidth="2" />
              </g>
            )}

            {equipped.desk === 'lamp' && (
              <g transform="translate(254, 134)">
                <ellipse cx="28" cy="54" rx="34" ry="18" fill="#F9D57E" opacity="0.32" />
                <rect x="24" y="34" width="6" height="32" rx="3" fill="#6B5849" />
                <ellipse cx="27" cy="66" rx="16" ry="5" fill="#2B2118" />
                <path d="M12 36 L42 36 L35 14 L19 14 Z" fill="#F4C76B" stroke="#2B2118" strokeWidth="2" strokeLinejoin="round" />
              </g>
            )}

            {equipped.desk === 'coffee-lokum' && (
              <g transform="translate(256, 162)">
                <ellipse cx="24" cy="42" rx="22" ry="5.5" fill="#E8DDD0" stroke="#2B2118" strokeWidth="1.8" />
                <path d="M14 24 L30 24 L27 40 L17 40 Z" fill="#FFFFFF" stroke="#2B2118" strokeWidth="2" strokeLinejoin="round" />
                <ellipse cx="22" cy="24" rx="8" ry="2.5" fill="#5C3A21" stroke="#2B2118" strokeWidth="1.6" />
                <rect x="34" y="33" width="8" height="8" rx="1.5" fill="#F472B6" stroke="#2B2118" strokeWidth="1.6" />
              </g>
            )}

            {/* Open Study Book when Focusing */}
            {mood === 'studying' && (
              <g transform="translate(54, 174)">
                <path d="M4 22 Q26 14 48 22 L48 36 Q26 28 4 36 Z" fill="#FFFFFF" stroke="#2B2118" strokeWidth="2" />
                <path d="M48 22 Q70 14 92 22 L92 36 Q70 28 48 36 Z" fill="#FFF9F2" stroke="#2B2118" strokeWidth="2" />
                <line x1="12" y1="25" x2="38" y2="25" stroke="#B59F8D" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="56" y1="25" x2="82" y2="25" stroke="#B59F8D" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            )}

            {/* Soft Pet Shadow */}
            <ellipse cx="165" cy="204" rx="52" ry="10" fill="#2B2118" opacity="0.11" />

            {/* Animated Character Layer */}
            <g className={mood === 'celebrating' ? 'animate-celebrate' : 'animate-breathe'}>
              {species === 'cat' ? (
                <g>
                  {/* Tail */}
                  <path
                    d="M204 182 Q238 176 232 146 Q228 134 218 140"
                    fill="none"
                    stroke="#D98B4E"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="animate-tail"
                  />
                  <path
                    d="M204 182 Q238 176 232 146 Q228 134 218 140"
                    fill="none"
                    stroke="#2B2118"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    className="animate-tail"
                  />
                  {/* Body */}
                  <ellipse cx="165" cy="164" rx="46" ry="38" fill="#E8A267" stroke="#2B2118" strokeWidth="2.8" />
                  <ellipse cx="165" cy="172" rx="28" ry="24" fill="#FFF2E2" />
                  {/* Paws */}
                  <ellipse cx="144" cy="197" rx="13" ry="8" fill="#FFF2E2" stroke="#2B2118" strokeWidth="2.4" />
                  <ellipse cx="186" cy="197" rx="13" ry="8" fill="#FFF2E2" stroke="#2B2118" strokeWidth="2.4" />
                  {/* Ears */}
                  <path d="M126 98 L120 62 L152 82 Z" fill="#E8A267" stroke="#2B2118" strokeWidth="2.8" strokeLinejoin="round" />
                  <path d="M129 90 L126 70 L144 82 Z" fill="#F4B6A4" />
                  <path d="M204 98 L210 62 L178 82 Z" fill="#E8A267" stroke="#2B2118" strokeWidth="2.8" strokeLinejoin="round" />
                  <path d="M201 90 L204 70 L186 82 Z" fill="#F4B6A4" />
                  {/* Head */}
                  <ellipse cx="165" cy="116" rx="46" ry="38" fill="#E8A267" stroke="#2B2118" strokeWidth="2.8" />
                  {/* Tekir Deseni */}
                  <path d="M156 80 L158 93 M165 79 L165 95 M174 80 L172 93" stroke="#B66A34" strokeWidth="3.2" strokeLinecap="round" />
                  {/* Cheeks */}
                  <ellipse cx="136" cy="126" rx="7" ry="4.5" fill="#E88B7A" opacity="0.6" />
                  <ellipse cx="194" cy="126" rx="7" ry="4.5" fill="#E88B7A" opacity="0.6" />
                  {/* Whiskers */}
                  <g stroke="#2B2118" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="112" y1="118" x2="128" y2="120" />
                    <line x1="110" y1="126" x2="128" y2="125" />
                    <line x1="202" y1="120" x2="218" y2="118" />
                    <line x1="202" y1="125" x2="220" y2="126" />
                  </g>
                  {/* Eyes */}
                  {mood === 'resting' ? (
                    <g fill="none" stroke="#2B2118" strokeWidth="2.6" strokeLinecap="round">
                      <path d="M142 117 Q148 122 154 117" />
                      <path d="M176 117 Q182 122 188 117" />
                    </g>
                  ) : mood === 'happy' || mood === 'celebrating' ? (
                    <g fill="none" stroke="#2B2118" strokeWidth="2.8" strokeLinecap="round">
                      <path d="M142 119 Q148 111 154 119" />
                      <path d="M176 119 Q182 111 188 119" />
                    </g>
                  ) : (
                    <g className="animate-blink">
                      <circle cx="148" cy="116" r="5" fill="#2B2118" />
                      <circle cx="146" cy="114" r="1.7" fill="#FFFFFF" />
                      <circle cx="182" cy="116" r="5" fill="#2B2118" />
                      <circle cx="180" cy="114" r="1.7" fill="#FFFFFF" />
                    </g>
                  )}
                  {/* Nose & Smile */}
                  <polygon points="161,123 169,123 165,128" fill="#D45D3A" />
                  <path d="M158 131 Q165 137 172 131" fill="none" stroke="#2B2118" strokeWidth="2.2" strokeLinecap="round" />
                </g>
              ) : species === 'bird' ? (
                /* Pıtır — Cozy Round Songbird */
                <g>
                  {/* Feet */}
                  <path d="M152 195 L150 205 M150 205 L144 205 M150 205 L156 205" stroke="#C97B40" strokeWidth="3" strokeLinecap="round" />
                  <path d="M178 195 L180 205 M180 205 L174 205 M180 205 L186 205" stroke="#C97B40" strokeWidth="3" strokeLinecap="round" />
                  {/* Tuft */}
                  <path d="M161 72 Q165 56 172 70 Q178 60 177 74" fill="#5D9A7C" stroke="#2B2118" strokeWidth="2.5" strokeLinejoin="round" />
                  {/* Plump Body */}
                  <ellipse cx="165" cy="136" rx="50" ry="58" fill="#6AA889" stroke="#2B2118" strokeWidth="2.8" />
                  <ellipse cx="165" cy="154" rx="34" ry="34" fill="#FFF7EB" />
                  {/* Wings */}
                  <ellipse cx="116" cy="144" rx="13" ry="24" transform="rotate(14 116 144)" fill="#528E70" stroke="#2B2118" strokeWidth="2.6" />
                  <ellipse cx="214" cy="144" rx="13" ry="24" transform="rotate(-14 214 144)" fill="#528E70" stroke="#2B2118" strokeWidth="2.6" />
                  {/* Cheeks */}
                  <ellipse cx="136" cy="126" rx="7" ry="4.5" fill="#E88B7A" opacity="0.65" />
                  <ellipse cx="194" cy="126" rx="7" ry="4.5" fill="#E88B7A" opacity="0.65" />
                  {/* Eyes */}
                  {mood === 'resting' ? (
                    <g fill="none" stroke="#2B2118" strokeWidth="2.6" strokeLinecap="round">
                      <path d="M142 116 Q148 121 154 116" />
                      <path d="M176 116 Q182 121 188 116" />
                    </g>
                  ) : mood === 'happy' || mood === 'celebrating' ? (
                    <g fill="none" stroke="#2B2118" strokeWidth="2.8" strokeLinecap="round">
                      <path d="M142 118 Q148 110 154 118" />
                      <path d="M176 118 Q182 110 188 118" />
                    </g>
                  ) : (
                    <g className="animate-blink">
                      <circle cx="148" cy="115" r="5" fill="#2B2118" />
                      <circle cx="146" cy="113" r="1.7" fill="#FFFFFF" />
                      <circle cx="182" cy="115" r="5" fill="#2B2118" />
                      <circle cx="180" cy="113" r="1.7" fill="#FFFFFF" />
                    </g>
                  )}
                  {/* Beak */}
                  <polygon points="158,122 172,122 165,132" fill="#E89D45" stroke="#2B2118" strokeWidth="2" strokeLinejoin="round" />
                </g>
              ) : species === 'dog' ? (
                <g>
                  {/* Wagging Tail */}
                  <path d="M204 176 Q234 162 226 142" fill="none" stroke="#C88A4B" strokeWidth="10" strokeLinecap="round" className="animate-tail" />
                  {/* Body */}
                  <ellipse cx="165" cy="170" rx="44" ry="34" fill="#E8B87D" stroke="#2B2118" strokeWidth="2.8" />
                  <ellipse cx="165" cy="178" rx="26" ry="22" fill="#FFF2DF" />
                  {/* Floppy Ears */}
                  <ellipse cx="116" cy="118" rx="13" ry="24" transform="rotate(14 116 118)" fill="#A96A38" stroke="#2B2118" strokeWidth="2.6" />
                  <ellipse cx="214" cy="118" rx="13" ry="24" transform="rotate(-14 214 118)" fill="#A96A38" stroke="#2B2118" strokeWidth="2.6" />
                  {/* Head */}
                  <circle cx="165" cy="116" r="40" fill="#E8B87D" stroke="#2B2118" strokeWidth="2.8" />
                  <ellipse cx="165" cy="129" rx="22" ry="15" fill="#FFF2DF" />
                  <circle cx="148" cy="112" r="4.8" fill="#2B2118" />
                  <circle cx="182" cy="112" r="4.8" fill="#2B2118" />
                  <ellipse cx="165" cy="123" rx="6" ry="4" fill="#2B2118" />
                  <path d="M159 130 Q165 136 171 130" fill="none" stroke="#2B2118" strokeWidth="2.4" strokeLinecap="round" />
                  <ellipse cx="137" cy="125" rx="6" ry="3.5" fill="#E68B78" opacity="0.45" />
                  <ellipse cx="193" cy="125" rx="6" ry="3.5" fill="#E68B78" opacity="0.45" />
                  <ellipse cx="145" cy="198" rx="10" ry="7" fill="#FFF2DF" stroke="#2B2118" strokeWidth="2.4" />
                  <ellipse cx="185" cy="198" rx="10" ry="7" fill="#FFF2DF" stroke="#2B2118" strokeWidth="2.4" />
                </g>
              ) : species === 'fox' ? (
                <g>
                  {/* Fluffy Tail */}
                  <path d="M202 182 Q244 176 238 142 Q226 134 212 152 Z" fill="#D96B27" stroke="#2B2118" strokeWidth="2.5" className="animate-tail" />
                  <circle cx="236" cy="144" r="8" fill="#FFF9F2" />
                  {/* Body */}
                  <ellipse cx="165" cy="170" rx="42" ry="33" fill="#D96B27" stroke="#2B2118" strokeWidth="2.8" />
                  <ellipse cx="165" cy="176" rx="24" ry="22" fill="#FFF9F2" />
                  {/* Pointy Ears */}
                  <polygon points="124,104 132,66 154,94" fill="#D96B27" stroke="#2B2118" strokeWidth="2.6" strokeLinejoin="round" />
                  <polygon points="206,104 198,66 176,94" fill="#D96B27" stroke="#2B2118" strokeWidth="2.6" strokeLinejoin="round" />
                  {/* Head */}
                  <ellipse cx="165" cy="116" rx="42" ry="36" fill="#D96B27" stroke="#2B2118" strokeWidth="2.8" />
                  <path d="M124 122 Q165 104 206 122 Q196 148 165 150 Q134 148 124 122 Z" fill="#FFF9F2" />
                  <circle cx="148" cy="112" r="4.5" fill="#2B2118" />
                  <circle cx="182" cy="112" r="4.5" fill="#2B2118" />
                  <circle cx="165" cy="126" r="4.5" fill="#2B2118" />
                  <path d="M159 133 Q165 138 171 133" fill="none" stroke="#2B2118" strokeWidth="2.2" strokeLinecap="round" />
                  <ellipse cx="145" cy="198" rx="9" ry="6.5" fill="#2B2118" />
                  <ellipse cx="185" cy="198" rx="9" ry="6.5" fill="#2B2118" />
                </g>
              ) : (
                <g>
                  {/* Bunny Ears */}
                  <ellipse cx="145" cy="64" rx="11" ry="30" transform="rotate(-8 145 64)" fill="#F9EFE6" stroke="#2B2118" strokeWidth="2.6" />
                  <ellipse cx="145" cy="66" rx="5" ry="20" transform="rotate(-8 145 66)" fill="#F3B8B2" />
                  <ellipse cx="185" cy="64" rx="11" ry="30" transform="rotate(8 185 64)" fill="#F9EFE6" stroke="#2B2118" strokeWidth="2.6" />
                  <ellipse cx="185" cy="66" rx="5" ry="20" transform="rotate(8 185 66)" fill="#F3B8B2" />
                  {/* Body */}
                  <ellipse cx="165" cy="172" rx="42" ry="32" fill="#F9EFE6" stroke="#2B2118" strokeWidth="2.8" />
                  {/* Head */}
                  <circle cx="165" cy="118" r="39" fill="#F9EFE6" stroke="#2B2118" strokeWidth="2.8" />
                  <circle cx="148" cy="114" r="4.6" fill="#2B2118" />
                  <circle cx="182" cy="114" r="4.6" fill="#2B2118" />
                  <ellipse cx="165" cy="124" rx="4.5" ry="3" fill="#E68B78" />
                  <path d="M160 130 Q165 135 170 130" fill="none" stroke="#2B2118" strokeWidth="2.2" strokeLinecap="round" />
                  <ellipse cx="137" cy="126" rx="6" ry="3.5" fill="#F3B8B2" opacity="0.65" />
                  <ellipse cx="193" cy="126" rx="6" ry="3.5" fill="#F3B8B2" opacity="0.65" />
                  <ellipse cx="146" cy="198" rx="11" ry="7" fill="#FFF9F2" stroke="#2B2118" strokeWidth="2.4" />
                  <ellipse cx="184" cy="198" rx="11" ry="7" fill="#FFF9F2" stroke="#2B2118" strokeWidth="2.4" />
                </g>
              )}

              {/* Neck Accessories */}
              {equipped.neck === 'red-bandana' && (
                <g>
                  <path d="M132 146 L198 146 L165 174 Z" fill="#DC2626" stroke="#2B2118" strokeWidth="2.2" strokeLinejoin="round" />
                </g>
              )}
              {equipped.neck === 'scarf' && (
                <g>
                  <rect x="128" y="144" width="74" height="14" rx="7" fill="#D45D3A" stroke="#2B2118" strokeWidth="2.2" />
                  <path d="M178 152 L192 152 L196 178 L180 178 Z" fill="#BC4D2C" stroke="#2B2118" strokeWidth="2.2" strokeLinejoin="round" />
                </g>
              )}
              {equipped.neck === 'bowtie' && (
                <g transform="translate(165, 150)">
                  <polygon points="-16,-8 0,0 -16,8" fill="#366B51" stroke="#2B2118" strokeWidth="2" strokeLinejoin="round" />
                  <polygon points="16,-8 0,0 16,8" fill="#366B51" stroke="#2B2118" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="0" cy="0" r="4.5" fill="#E8DDD0" stroke="#2B2118" strokeWidth="2" />
                </g>
              )}

              {/* Head Accessories */}
              {(equipped.head === 'glasses' || mood === 'studying') && (
                <g fill="none" stroke="#2B2118" strokeWidth="2.4">
                  <circle cx="148" cy="116" r="12" fill="rgba(255,255,255,0.22)" />
                  <circle cx="182" cy="116" r="12" fill="rgba(255,255,255,0.22)" />
                  <line x1="160" y1="116" x2="170" y2="116" />
                </g>
              )}
              {equipped.head === 'beanie' && (
                <g>
                  <path d="M126 94 Q165 56 204 94 Z" fill="#D49A38" stroke="#2B2118" strokeWidth="2.4" />
                  <rect x="122" y="88" width="86" height="12" rx="6" fill="#B7791F" stroke="#2B2118" strokeWidth="2.2" />
                  <circle cx="165" cy="64" r="7" fill="#FFF9F2" stroke="#2B2118" strokeWidth="2.2" />
                </g>
              )}
              {equipped.head === 'headphones' && (
                <g>
                  <path d="M118 112 Q118 68 165 68 Q212 68 212 112" fill="none" stroke="#2B2118" strokeWidth="4.5" strokeLinecap="round" />
                  <rect x="109" y="102" width="14" height="28" rx="6" fill="#D45D3A" stroke="#2B2118" strokeWidth="2.2" />
                  <rect x="207" y="102" width="14" height="28" rx="6" fill="#D45D3A" stroke="#2B2118" strokeWidth="2.2" />
                </g>
              )}
              {equipped.head === 'flower-crown' && (
                <g transform="translate(165, 82)">
                  {[-24, 0, 24].map((dx) => (
                    <g key={dx} transform={`translate(${dx}, 0)`}>
                      <circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#2B2118" strokeWidth="1.6" />
                      <circle cx="0" cy="0" r="3.5" fill="#F59E0B" />
                    </g>
                  ))}
                </g>
              )}

              {/* Resting Zzz */}
              {mood === 'resting' && (
                <text x="210" y="86" fill="#6B5849" fontSize="16" fontWeight="700" fontFamily="Outfit">
                  zZz
                </text>
              )}
            </g>
          </svg>

          {/* Floating Hearts on Click */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {hearts.map((id) => (
              <Heart
                key={id}
                className="animate-heart absolute w-6 h-6 text-[#D45D3A] fill-[#D45D3A]"
                style={{ left: `${44 + (id % 16)}%`, top: '38%' }}
              />
            ))}
          </div>

          <span className="absolute bottom-2.5 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[#6B5849] border border-[#E8DDD0] shadow-xs group-hover:bg-white transition-colors">
            Okşamak için dokun
          </span>
        </button>

        {/* Interactive Mini-Game Star Overlay */}
        {gameActive && (
          <div className="absolute inset-x-4 top-3 bottom-2 rounded-2xl bg-[#1E1B2E]/25 backdrop-blur-[1px] z-20 flex flex-col justify-between p-3 pointer-events-auto">
            <div className="flex items-center justify-between bg-white/95 rounded-full px-3 py-1 text-xs font-extrabold text-[#2B2118] shadow-sm">
              <span>Yıldız Yakala! · {gameSeconds} sn</span>
              <span className="text-[#D45D3A]">Skor: {gameScore} (+{gameScore * 3} Pati)</span>
            </div>
            <button
              type="button"
              onClick={catchStar}
              aria-label="Yıldızı yakala"
              style={{ left: `${starPos.x}%`, top: `${starPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#FFE600] border-2 border-[#2B2118] shadow-[0_4px_0_#2B2118] active:translate-y-[-46%] cursor-pointer animate-bounce"
            >
              <Star className="w-6 h-6 text-[#D45D3A] fill-[#D45D3A]" />
            </button>
          </div>
        )}

        {/* Tactile Game Action Dock */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={handlePet}
            className="rounded-2xl border-2 border-[#E8DDD0] bg-[#FFFDF9] py-2 px-2 text-xs font-extrabold text-[#2B2118] shadow-[0_4px_0_#E8DDD0] active:translate-y-[2px] flex flex-col items-center gap-1 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#D45D3A]" />
            <span>Okşa</span>
          </button>
          <button
            type="button"
            onClick={onFeedPet}
            disabled={coins < 5}
            className="rounded-2xl border-2 border-[#EED7A7] bg-[#FDF4E3] py-2 px-2 text-xs font-extrabold text-[#9B6515] shadow-[0_4px_0_#E6C98F] active:translate-y-[2px] disabled:opacity-50 flex flex-col items-center gap-1 cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Besle (5)</span>
          </button>
          <button
            type="button"
            onClick={startStarGame}
            className="rounded-2xl border-2 border-[#C7E2D4] bg-[#EAF5EF] py-2 px-2 text-xs font-extrabold text-[#214B36] shadow-[0_4px_0_#B7D6C5] active:translate-y-[2px] flex flex-col items-center gap-1 cursor-pointer"
          >
            <Star className="w-4 h-4 text-[#D97706]" />
            <span>{gameActive ? `${gameSeconds}s` : 'Mini Oyun'}</span>
          </button>
          <button
            type="button"
            onClick={onCycleRoom}
            className="rounded-2xl border-2 border-[#E8DDD0] bg-[#FFFDF9] py-2 px-2 text-xs font-extrabold text-[#6B5849] shadow-[0_4px_0_#E8DDD0] active:translate-y-[2px] flex flex-col items-center gap-1 cursor-pointer"
          >
            <Sun className="w-4 h-4 text-[#D45D3A]" />
            <span>Oda Değiş</span>
          </button>
        </div>

        {/* Warm Companion Speech Bubble */}
        <div className="mt-3 rounded-2xl bg-[#FFF9F2] border border-[#EDE3D7] px-4 py-3 text-sm leading-relaxed text-[#2B2118]">
          “{quote}”
        </div>
      </div>

      {/* Energy & Growth Progress Bars */}
      <div className="px-5 pt-2 pb-5 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-[#2B2118]">Günlük Enerji</span>
            <span className="tabular-nums text-[#366B51]">
              {todayEnergy} / {energyGoal}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#F2E9DF] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#366B51] transition-all duration-500"
              style={{ width: `${energyPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#6B5849] mb-1">
              <span>Büyüme ({stage.name})</span>
              <span className="tabular-nums">{progressPct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#F2E9DF] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#D45D3A] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWardrobe}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#2B2118] px-3.5 py-2 text-xs font-semibold text-[#FFF9F2] hover:bg-[#3F3124] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F6C86E]" />
            Atölye
          </button>
        </div>
      </div>
    </section>
  );
}
