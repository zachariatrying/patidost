import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  CheckSquare,
  Timer,
  BookHeart,
  X,
  Wind,
  ShieldCheck,
  ImageDown,
  Download,
  Upload,
  Trash2,
  BarChart3,
} from 'lucide-react';
import type { AccessorySlot, AppState, CosmeticItem, MoodLevel, PetMood, PetSpecies } from './types';
import { INITIAL_TASKS, MOOD_OPTIONS, PET_QUOTES, TASK_PACKS } from './data/catalog';
import { playSoftChime } from './utils/sound';
import { downloadPatiCardPng } from './utils/storyCard';
import { PetStage } from './components/PetStage';
import { MicroTasksPanel } from './components/MicroTasksPanel';
import { FocusPomodoro } from './components/FocusPomodoro';
import { BreathingWidget } from './components/BreathingWidget';
import { WardrobeModal } from './components/WardrobeModal';
import { MoodJournal } from './components/MoodJournal';

const STORAGE_KEY = 'patidost_state_v1';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function createInitialState(): AppState {
  return {
    petName: 'Mırnav',
    species: 'cat',
    xp: 40,
    coins: 55,
    todayEnergy: 20,
    energyGoal: 100,
    restDayActive: false,
    soundEnabled: true,
    activeRoom: 'kadikoy',
    equipped: {
      head: null,
      neck: null,
      desk: 'tea',
    },
    ownedItems: ['tea', 'room-kadikoy'],
    tasks: INITIAL_TASKS,
    moodEntries: [],
    focusLogs: [],
    lastActiveDate: todayKey(),
    pettingCountToday: 0,
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as AppState;
    const today = todayKey();
    if (parsed.lastActiveDate !== today) {
      // Gentle daily refresh without breaking anything or punishing the user
      return {
        ...parsed,
        todayEnergy: 0,
        restDayActive: false,
        pettingCountToday: 0,
        lastActiveDate: today,
        tasks: parsed.tasks.map((t) => ({ ...t, done: false })),
      };
    }
    return parsed;
  } catch {
    return createInitialState();
  }
}

type MobileTab = 'adimlar' | 'odak' | 'nefes' | 'gunluk';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [isFocusing, setIsFocusing] = useState(false);
  const [transientMood, setTransientMood] = useState<PetMood | null>(null);
  const [quote, setQuote] = useState<string>(PET_QUOTES.calm[0]);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('adimlar');

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const utm_source = sp.get('utm_source');
      const utm_campaign = sp.get('utm_campaign');
      const utm_medium = sp.get('utm_medium');
      if (utm_source || utm_campaign || utm_medium) {
        localStorage.setItem(
          'patidost_utm_attribution_v1',
          JSON.stringify({
            utm_source,
            utm_campaign,
            utm_medium,
            landedAt: new Date().toISOString(),
          })
        );
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [state]);

  const activeMood: PetMood = transientMood
    ? transientMood
    : isFocusing
      ? 'studying'
      : state.restDayActive
        ? 'resting'
        : 'calm';

  const pickQuote = (moodKey: PetMood) => {
    const list = PET_QUOTES[moodKey];
    return list[Math.floor(Math.random() * list.length)];
  };

  const flashMood = (nextMood: PetMood, durationMs = 2400) => {
    setTransientMood(nextMood);
    setQuote(pickQuote(nextMood));
    window.setTimeout(() => {
      setTransientMood(null);
    }, durationMs);
  };

  const handlePetClick = () => {
    playSoftChime('tap', state.soundEnabled);
    setState((prev) => ({
      ...prev,
      pettingCountToday: prev.pettingCountToday + 1,
      xp: prev.xp + (prev.pettingCountToday < 5 ? 4 : 0),
    }));
    flashMood('happy', 2200);
  };

  const handleToggleTask = (id: string) => {
    setState((prev) => {
      const target = prev.tasks.find((t) => t.id === id);
      if (!target) return prev;
      const completing = !target.done;
      if (completing) {
        playSoftChime('complete', prev.soundEnabled);
      }
      return {
        ...prev,
        xp: Math.max(0, prev.xp + (completing ? target.energy : -target.energy)),
        coins: Math.max(0, prev.coins + (completing ? target.coins : -target.coins)),
        todayEnergy: Math.max(0, prev.todayEnergy + (completing ? target.energy : -target.energy)),
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, done: completing } : t)),
      };
    });
    const current = state.tasks.find((t) => t.id === id);
    if (current && !current.done) {
      flashMood('celebrating', 2600);
    }
  };

  const handleAddTask = (title: string) => {
    setState((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: `t-${Date.now()}`,
          title,
          packId: 'custom',
          energy: 15,
          coins: 15,
          done: false,
        },
      ],
    }));
  };

  const handleDeleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const handleAddPack = (packId: string) => {
    const pack = TASK_PACKS.find((p) => p.id === packId);
    if (!pack) return;
    setState((prev) => {
      const existingTitles = new Set(prev.tasks.map((t) => t.title));
      const newTasks = pack.tasks
        .filter((t) => !existingTitles.has(t.title))
        .map((t, idx) => ({
          id: `t-${packId}-${Date.now()}-${idx}`,
          title: t.title,
          packId,
          energy: t.energy,
          coins: t.coins,
          done: false,
        }));
      return { ...prev, tasks: [...prev.tasks, ...newTasks] };
    });
  };

  const handleFocusStatusChange = useCallback((focusing: boolean) => {
    setIsFocusing(focusing);
    if (focusing) {
      setQuote(PET_QUOTES.studying[0]);
    }
  }, []);

  const handleCompleteFocus = useCallback(
    (minutes: number, label: string, coins: number) => {
      playSoftChime('bell', state.soundEnabled);
      setState((prev) => ({
        ...prev,
        xp: prev.xp + minutes,
        coins: prev.coins + coins,
        todayEnergy: prev.todayEnergy + Math.min(35, minutes),
        focusLogs: [
          {
            id: `f-${Date.now()}`,
            dateIso: new Date().toISOString(),
            minutes,
            label,
            coinsEarned: coins,
          },
          ...prev.focusLogs,
        ],
      }));
      flashMood('celebrating', 3200);
    },
    [state.soundEnabled]
  );

  const handleBuyOrEquip = (item: CosmeticItem) => {
    setState((prev) => {
      const alreadyOwned = prev.ownedItems.includes(item.id) || item.price === 0;
      if (!alreadyOwned && prev.coins < item.price) return prev;
      playSoftChime('complete', prev.soundEnabled);

      const nextCoins = alreadyOwned ? prev.coins : prev.coins - item.price;
      const nextOwned = alreadyOwned ? prev.ownedItems : [...prev.ownedItems, item.id];

      if (item.slot === 'room' && item.roomId) {
        return {
          ...prev,
          coins: nextCoins,
          ownedItems: nextOwned,
          activeRoom: item.roomId,
        };
      }
      return {
        ...prev,
        coins: nextCoins,
        ownedItems: nextOwned,
        equipped: {
          ...prev.equipped,
          [item.slot]: item.id,
        },
      };
    });
    flashMood('happy', 2200);
  };

  const handleUnequipSlot = (slot: AccessorySlot) => {
    setState((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [slot]: null,
      },
    }));
  };

  const handleSaveMood = (level: MoodLevel, note: string) => {
    playSoftChime('complete', state.soundEnabled);
    setState((prev) => ({
      ...prev,
      coins: prev.coins + 15,
      xp: prev.xp + 12,
      moodEntries: [
        {
          id: `m-${Date.now()}`,
          dateIso: new Date().toISOString(),
          level,
          note,
        },
        ...prev.moodEntries,
      ],
    }));
  };

  const handleToggleRestDay = () => {
    setState((prev) => {
      const next = !prev.restDayActive;
      setQuote(next ? PET_QUOTES.resting[0] : PET_QUOTES.calm[0]);
      return { ...prev, restDayActive: next };
    });
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patidost-yedek-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSpeciesChange = (species: PetSpecies) => {
    setState((prev) => ({
      ...prev,
      species,
      petName: prev.petName === 'Mırnav' && species === 'bird' ? 'Pıtır' : prev.petName === 'Pıtır' && species === 'cat' ? 'Mırnav' : prev.petName,
    }));
  };

  const handleCompleteBreathing = useCallback(() => {
    playSoftChime('complete', state.soundEnabled);
    setState((prev) => ({
      ...prev,
      xp: prev.xp + 15,
      coins: prev.coins + 15,
      todayEnergy: prev.todayEnergy + 15,
    }));
    flashMood('calm', 2800);
  }, [state.soundEnabled]);

  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppState;
        if (!parsed.petName || !Array.isArray(parsed.tasks)) {
          setImportMsg('Geçersiz PatiDost yedek dosyası.');
          return;
        }
        setState(parsed);
        setImportMsg('Yedeğin başarıyla geri yüklendi!');
      } catch {
        setImportMsg('JSON dosyası okunamadı.');
      }
    };
    reader.readAsText(file);
  };

  const handlePurgeAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(createInitialState());
    setConfirmReset(false);
    setImportMsg('Tüm yerel verilerin temizlendi ve başlangıç durumuna döndürüldü.');
  };

  // Compute 7-day analytics metrics
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentFocusMin = state.focusLogs
    .filter((f) => new Date(f.dateIso).getTime() >= sevenDaysAgo)
    .reduce((acc, f) => acc + f.minutes, 0);
  const recentMoods = state.moodEntries.filter(
    (m) => new Date(m.dateIso).getTime() >= sevenDaysAgo
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#EDE3D7] bg-[#FFF9F2]/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}store-assets/patidost_icon.png`} alt="PatiDost" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-[#2B2118]">
                PatiDost
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-[#6B5849]">
                Türkçe öz-bakım ve odaklanma dostun
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => downloadPatiCardPng(state)}
              title="1080x1350 günlük kart indir"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E8DDD0] bg-white px-3 py-1.5 text-xs font-bold text-[#2B2118] hover:bg-[#F5ECE1] transition-colors cursor-pointer"
            >
              <ImageDown className="w-3.5 h-3.5 text-[#D45D3A]" />
              Günün Kartı
            </button>

            <button
              type="button"
              onClick={() => setKvkkOpen(true)}
              title="KVKK ve Veri Kontrolü"
              className="inline-flex items-center gap-1 rounded-full border border-[#E8DDD0] bg-white px-2.5 py-1.5 text-xs font-bold text-[#6B5849] hover:bg-[#F5ECE1] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#366B51]" />
              <span className="hidden md:inline">KVKK</span>
            </button>

            <button
              type="button"
              onClick={() => setWardrobeOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF4E3] border border-[#EED7A7] px-3.5 py-1.5 text-xs font-bold tabular-nums text-[#9B6515] hover:bg-[#FAEBC9] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {state.coins} pati
            </button>

            <button
              type="button"
              onClick={() => setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              aria-label={state.soundEnabled ? 'Sesi kapat' : 'Sesi aç'}
              className="rounded-full border border-[#E8DDD0] bg-white p-2 text-[#6B5849] hover:bg-[#F5ECE1] transition-colors cursor-pointer"
            >
              {state.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Layout */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 pb-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Living Companion Stage */}
          <div className="lg:col-span-5 lg:sticky lg:top-22">
            <PetStage
              petName={state.petName}
              species={state.species}
              mood={activeMood}
              xp={state.xp}
              todayEnergy={state.todayEnergy}
              energyGoal={state.energyGoal}
              room={state.activeRoom}
              equipped={state.equipped}
              quote={quote}
              restDayActive={state.restDayActive}
              onPetClick={handlePetClick}
              onOpenCustomize={() => setCustomizeOpen(true)}
              onOpenWardrobe={() => setWardrobeOpen(true)}
              onToggleRestDay={handleToggleRestDay}
            />
          </div>

          {/* Right Column: Action Workspace */}
          <div className="lg:col-span-7 space-y-6">
            <div className={mobileTab === 'adimlar' ? 'block' : 'hidden lg:block'}>
              <MicroTasksPanel
                tasks={state.tasks}
                restDayActive={state.restDayActive}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onAddPack={handleAddPack}
              />
            </div>

            <div className={mobileTab === 'odak' ? 'block' : 'hidden lg:block'}>
              <FocusPomodoro
                petName={state.petName}
                focusLogs={state.focusLogs}
                onStatusChange={handleFocusStatusChange}
                onCompleteSession={handleCompleteFocus}
              />
            </div>

            <div className={mobileTab === 'nefes' ? 'block' : 'hidden lg:block'}>
              <BreathingWidget
                petName={state.petName}
                soundEnabled={state.soundEnabled}
                onCompleteRound={handleCompleteBreathing}
              />
            </div>

            <div className={mobileTab === 'gunluk' ? 'block' : 'hidden lg:block'}>
              {/* 7-Day Mood & Focus Analytics Card (Haftalık Özet) */}
              <section
                aria-label="Haftalık ruh hali ve odak özeti"
                className="mb-6 rounded-3xl border border-[#E8DDD0] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(43,33,24,0.18)]"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="text-base font-bold text-[#2B2118] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#366B51]" />
                    7 Günlük Şefkatli Özet
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      state.restDayActive
                        ? 'bg-[#EAF3EE] text-[#214B36]'
                        : 'bg-[#FFF9F2] text-[#6B5849] border border-[#E8DDD0]'
                    }`}
                  >
                    {state.restDayActive ? 'Dinlenme Günü Aktif 🌿' : 'Rutin Akışı'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-2xl bg-[#FDF4E3] p-3">
                    <div className="text-lg font-extrabold text-[#9B6515] tabular-nums">
                      {recentFocusMin} dk
                    </div>
                    <div className="text-[11px] font-semibold text-[#6B5849]">Son 7 Gün Odak</div>
                  </div>
                  <div className="rounded-2xl bg-[#EAF3EE] p-3">
                    <div className="text-lg font-extrabold text-[#214B36] tabular-nums">
                      {recentMoods.length}
                    </div>
                    <div className="text-[11px] font-semibold text-[#6B5849]">Hâl Hatır Kaydı</div>
                  </div>
                  <div className="rounded-2xl bg-[#FDF1EB] p-3">
                    <div className="text-lg font-extrabold text-[#B84323] tabular-nums">
                      {state.tasks.filter((t) => t.done).length}/{state.tasks.length}
                    </div>
                    <div className="text-[11px] font-semibold text-[#6B5849]">Bugünkü Adım</div>
                  </div>
                </div>
                {recentMoods.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {MOOD_OPTIONS.map((opt) => {
                      const count = recentMoods.filter((m) => m.level === opt.level).length;
                      if (count === 0) return null;
                      return (
                        <span
                          key={opt.level}
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums"
                          style={{ backgroundColor: opt.bg, color: opt.color }}
                        >
                          {opt.label}: {count}
                        </span>
                      );
                    })}
                  </div>
                )}
              </section>

              <MoodJournal
                entries={state.moodEntries}
                onSaveMood={handleSaveMood}
                onExportBackup={handleExportBackup}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobil gezinti"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#E8DDD0] bg-white/95 backdrop-blur-md px-3 py-2"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setMobileTab('adimlar')}
            className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs font-semibold cursor-pointer ${
              mobileTab === 'adimlar' ? 'bg-[#FDF1EB] text-[#D45D3A]' : 'text-[#6B5849]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Adımlar
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('odak')}
            className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs font-semibold cursor-pointer ${
              mobileTab === 'odak' ? 'bg-[#EAF3EE] text-[#366B51]' : 'text-[#6B5849]'
            }`}
          >
            <Timer className="w-4 h-4" />
            Odak
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('nefes')}
            className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs font-semibold cursor-pointer ${
              mobileTab === 'nefes' ? 'bg-[#EAF3EE] text-[#366B51]' : 'text-[#6B5849]'
            }`}
          >
            <Wind className="w-4 h-4" />
            Nefes
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('gunluk')}
            className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs font-semibold cursor-pointer ${
              mobileTab === 'gunluk' ? 'bg-[#FDF1EB] text-[#D45D3A]' : 'text-[#6B5849]'
            }`}
          >
            <BookHeart className="w-4 h-4" />
            Günlük
          </button>
        </div>
      </nav>

      {/* Non-Clinical Footer Disclaimer */}
      <footer className="hidden lg:block border-t border-[#EDE3D7] py-4 text-center text-xs text-[#8C7766]">
        PatiDost tıbbi veya klinik bir terapi aracı değildir; verilerin yalnızca tarayıcında yerel olarak saklanır.
      </footer>

      {/* Wardrobe Modal */}
      <WardrobeModal
        open={wardrobeOpen}
        coins={state.coins}
        ownedItems={state.ownedItems}
        activeRoom={state.activeRoom}
        equipped={state.equipped}
        onClose={() => setWardrobeOpen(false)}
        onBuyOrEquip={handleBuyOrEquip}
        onUnequipSlot={handleUnequipSlot}
      />

      {/* Customize Companion Modal */}
      {customizeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2118]/45 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Dostunu Özelleştir"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E8DDD0] bg-[#FFF9F2] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#2B2118]">Dostunu Özelleştir</h2>
              <button
                type="button"
                onClick={() => setCustomizeOpen(false)}
                aria-label="Kapat"
                className="rounded-full p-1.5 text-[#6B5849] hover:bg-[#F5ECE1] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-[#6B5849] mb-2">Tür Seçimi</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'cat', title: 'İstanbul Tekiri', desc: 'Sıcakkanlı, meraklı kedi', activeCls: 'border-[#D45D3A] bg-[#FDF1EB]' },
                      { id: 'bird', title: 'Neşeli Saka Kuşu', desc: 'Hafif, sakin kanatlı dost', activeCls: 'border-[#366B51] bg-[#EAF3EE]' },
                      { id: 'dog', title: 'Altın Köpek', desc: 'Sadık, neşeli yürüyüş arkadaşı', activeCls: 'border-[#C88A4B] bg-[#FEF6EB]' },
                      { id: 'fox', title: 'Kızıl Tilki', desc: 'Zeki, sessiz odaklanma dostu', activeCls: 'border-[#D96B27] bg-[#FFF1E6]' },
                      { id: 'bunny', title: 'Pamuk Tavşan', desc: 'Yumuşak, huzurlu dinlenme dostu', activeCls: 'border-[#D9778A] bg-[#FDF2F4]' },
                    ] as const
                  ).map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => handleSpeciesChange(sp.id)}
                      className={`rounded-2xl border p-3 text-left transition-colors cursor-pointer ${
                        state.species === sp.id ? sp.activeCls : 'border-[#E8DDD0] bg-white'
                      }`}
                    >
                      <div className="text-sm font-bold text-[#2B2118]">{sp.title}</div>
                      <div className="text-[11px] text-[#6B5849] mt-0.5">{sp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="pet-name-input" className="block text-xs font-semibold text-[#6B5849] mb-1.5">
                  Dostunun Adı
                </label>
                <input
                  id="pet-name-input"
                  type="text"
                  maxLength={20}
                  value={state.petName}
                  onChange={(e) => setState((prev) => ({ ...prev, petName: e.target.value }))}
                  className="w-full rounded-xl border border-[#E2D6C8] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#2B2118] focus:border-[#D45D3A] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setCustomizeOpen(false)}
                className="w-full rounded-xl bg-[#2B2118] py-2.5 text-sm font-semibold text-[#FFF9F2] hover:bg-[#3F3124] transition-colors cursor-pointer"
              >
                Kaydet ve Devam Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KVKK & Backup Data Control Modal (Apple 5.1.1(v)) */}
      {kvkkOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2118]/45 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label="KVKK ve Veri Kontrolü"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E8DDD0] bg-[#FFF9F2] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#366B51]" />
                <h2 className="text-lg font-bold text-[#2B2118]">KVKK & Veri Kontrolü</h2>
              </div>
              <button
                type="button"
                onClick={() => setKvkkOpen(false)}
                aria-label="Kapat"
                className="rounded-full p-1.5 text-[#6B5849] hover:bg-[#F5ECE1] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B5849] leading-relaxed">
              PatiDost sıfır reklam ve sıfır üçüncü parti takip ilkesiyle çalışır. Tüm görevlerin, nefes
              seansların ve ruh hali günlüklerin yalnızca cihazında saklanır.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#366B51] py-2.5 text-xs font-bold text-white hover:bg-[#2A5540] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                JSON Yedek İndir
              </button>
              <label className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-white py-2.5 text-xs font-bold text-[#2B2118] hover:bg-[#F5ECE1] cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Yedek Yükle
                <input type="file" accept=".json,application/json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>

            <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 space-y-2">
              <div className="text-xs font-bold text-[#991B1B]">Tüm Yerel Verileri Sıfırla</div>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#DC2626] px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Tüm Verilerimi Sil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePurgeAllData}
                    className="rounded-xl bg-[#DC2626] px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    Evet, Sıfırla
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="rounded-xl border border-[#E8DDD0] bg-white px-3.5 py-2 text-xs font-bold text-[#2B2118] cursor-pointer"
                  >
                    Vazgeç
                  </button>
                </div>
              )}
            </div>

            {importMsg && (
              <div className="rounded-xl bg-[#EAF3EE] border border-[#CFE3D7] px-3 py-2 text-xs font-semibold text-[#214B36]">
                {importMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
