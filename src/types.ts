export type PetSpecies = 'cat' | 'bird' | 'dog' | 'fox' | 'bunny';

export type PetMood = 'calm' | 'happy' | 'studying' | 'resting' | 'celebrating';

export type RoomId = 'kadikoy' | 'desk' | 'rainy' | 'garden' | 'bosphorus' | 'night_sky';

export type AccessorySlot = 'head' | 'neck' | 'desk';

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  slot: AccessorySlot | 'room';
  price: number;
  roomId?: RoomId;
}

export interface MicroTask {
  id: string;
  title: string;
  packId: string;
  energy: number;
  coins: number;
  done: boolean;
  isPrimary?: boolean;
}

export interface TaskPack {
  id: string;
  name: string;
  tagline: string;
  tasks: Array<{ title: string; energy: number; coins: number }>;
}

export type MoodLevel = 'harika' | 'sakin' | 'normal' | 'yorgun' | 'bunaltici';

export interface MoodEntry {
  id: string;
  dateIso: string;
  level: MoodLevel;
  note: string;
}

export interface FocusLog {
  id: string;
  dateIso: string;
  minutes: number;
  label: string;
  coinsEarned: number;
}

export interface AppState {
  petName: string;
  species: PetSpecies;
  xp: number;
  coins: number;
  todayEnergy: number;
  energyGoal: number;
  restDayActive: boolean;
  soundEnabled: boolean;
  activeRoom: RoomId;
  equipped: {
    head: string | null;
    neck: string | null;
    desk: string | null;
  };
  ownedItems: string[];
  tasks: MicroTask[];
  moodEntries: MoodEntry[];
  focusLogs: FocusLog[];
  lastActiveDate: string;
  pettingCountToday: number;
}
