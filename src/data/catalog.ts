import type { CosmeticItem, MicroTask, MoodLevel, TaskPack } from '../types';

export interface GrowthStage {
  name: string;
  minXp: number;
  nextXp: number;
  note: string;
}

export const GROWTH_STAGES: GrowthStage[] = [
  { name: 'Minik Pati', minXp: 0, nextXp: 120, note: 'Dünyayı yeni yeni keşfediyor.' },
  { name: 'Meraklı Dost', minXp: 120, nextXp: 300, note: 'Seninle her gün ritim tutturuyor.' },
  { name: 'Bilge Yoldaş', minXp: 300, nextXp: 600, note: 'Zor günlerde bile yanında sakin kalıyor.' },
  { name: 'Efsane Dost', minXp: 600, nextXp: 1000, note: 'Birlikte kurduğunuz alışkanlıklar artık doğanız.' },
];

export function getGrowthStage(xp: number): {
  stage: GrowthStage;
  level: number;
  progressPct: number;
} {
  let idx = 0;
  for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
    if (xp >= GROWTH_STAGES[i].minXp) {
      idx = i;
      break;
    }
  }
  const stage = GROWTH_STAGES[idx];
  const span = Math.max(1, stage.nextXp - stage.minXp);
  const progressPct = Math.min(100, Math.round(((xp - stage.minXp) / span) * 100));
  return { stage, level: idx + 1, progressPct };
}

export const TASK_PACKS: TaskPack[] = [
  {
    id: 'sabah',
    name: 'Yumuşak Başlangıç',
    tagline: 'Güne küçük ve baskısız adımlarla gir',
    tasks: [
      { title: '1 büyük bardak su iç', energy: 15, coins: 12 },
      { title: 'Perdeyi aç, 1 dakika gün ışığına bak', energy: 15, coins: 12 },
      { title: 'Yatağını kabaca topla', energy: 15, coins: 15 },
      { title: 'Bugün için tek bir öncelik seç', energy: 20, coins: 18 },
    ],
  },
  {
    id: 'yks',
    name: 'YKS / KPSS & Ders Odak',
    tagline: 'Büyük hedefi 25 dakikalık lokmalara böl',
    tasks: [
      { title: 'Telefonu başka odaya bırakıp 1 Pomodoro yap', energy: 25, coins: 24 },
      { title: '20 soru çöz ve yanlışlarını işaretle', energy: 25, coins: 22 },
      { title: 'Çalışma masanı 2 dakika düzenle', energy: 15, coins: 12 },
      { title: 'Kısa bir konu özeti çıkar (5 satır yeter)', energy: 20, coins: 18 },
    ],
  },
  {
    id: 'hareket',
    name: 'Beden & Nefes',
    tagline: 'Ekran başından kalk, omuzlarını gevşet',
    tasks: [
      { title: 'Omuz ve boyun için 2 dakika esne', energy: 15, coins: 14 },
      { title: '10 dakika tempolu yürüyüş veya balkonda nefes', energy: 25, coins: 22 },
      { title: 'Gözlerini 20 saniye uzağa dinlendir', energy: 10, coins: 10 },
    ],
  },
  {
    id: 'aksam',
    name: 'Akşam Dijital Mola',
    tagline: 'Zihnini sakinleştirip uykuya hazırlan',
    tasks: [
      { title: 'Yatmadan 30 dk önce ekran parlaklığını kıs', energy: 15, coins: 14 },
      { title: 'Yarın giyeceğin kıyafeti veya çantanı hazırla', energy: 15, coins: 15 },
      { title: 'Bugünden iyi giden tek bir şeyi yaz', energy: 20, coins: 18 },
    ],
  },
];

export const INITIAL_TASKS: MicroTask[] = [
  {
    id: 't-1',
    title: '1 büyük bardak su iç',
    packId: 'sabah',
    energy: 15,
    coins: 12,
    done: false,
    isPrimary: true,
  },
  {
    id: 't-2',
    title: 'Çalışma masanı 2 dakika düzenle',
    packId: 'yks',
    energy: 15,
    coins: 15,
    done: false,
    isPrimary: true,
  },
  {
    id: 't-3',
    title: '25 dakikalık bir odaklanma seansı tamamla',
    packId: 'yks',
    energy: 25,
    coins: 24,
    done: false,
    isPrimary: true,
  },
  {
    id: 't-4',
    title: 'Omuz ve boyun için 2 dakika esne',
    packId: 'hareket',
    energy: 15,
    coins: 14,
    done: false,
  },
  {
    id: 't-5',
    title: 'Bugünden iyi giden tek bir şeyi günlüğe ekle',
    packId: 'aksam',
    energy: 20,
    coins: 18,
    done: false,
  },
];

export const COSMETIC_ITEMS: CosmeticItem[] = [
  {
    id: 'glasses',
    name: 'Yuvarlak Çalışma Gözlüğü',
    description: 'Ders ve derin odaklanma seanslarının vazgeçilmezi.',
    slot: 'head',
    price: 35,
  },
  {
    id: 'beanie',
    name: 'Hardal Örgü Bere',
    description: 'Serin sabahlarda sıcak tutan yumuşak bere.',
    slot: 'head',
    price: 55,
  },
  {
    id: 'headphones',
    name: 'Lo-Fi Kulaklık',
    description: 'Dış dünyayı kıs, sadece ritme ve işine odaklan.',
    slot: 'head',
    price: 75,
  },
  {
    id: 'scarf',
    name: 'Tarçın Örgü Atkı',
    description: 'El örgüsü hissi veren sıcak tarçın atkı.',
    slot: 'neck',
    price: 40,
  },
  {
    id: 'bowtie',
    name: 'Adaçayı Papyon',
    description: 'Önemli sunumlar ve yeni başlangıçlar için şık detay.',
    slot: 'neck',
    price: 50,
  },
  {
    id: 'tea',
    name: 'İnce Belli Çay',
    description: 'Taze demlenmiş, dumanı tüten sıcak çalışma arkadaşı.',
    slot: 'desk',
    price: 0,
  },
  {
    id: 'plant',
    name: 'Minik Sukulent',
    description: 'Masaya canlılık katan seramik saksılı sukulent.',
    slot: 'desk',
    price: 30,
  },
  {
    id: 'lamp',
    name: 'Sıcak Masa Lambası',
    description: 'Gece çalışanlara huzurlu kehribar ışığı.',
    slot: 'desk',
    price: 60,
  },
  {
    id: 'room-kadikoy',
    name: 'Kadıköy Balkonu',
    description: 'Sıcak gün ışığı ve ferah gökyüzüyle tanıdık bir sabah.',
    slot: 'room',
    roomId: 'kadikoy',
    price: 0,
  },
  {
    id: 'room-desk',
    name: 'Sıcak Çalışma Odası',
    description: 'Kitap raflı, düzenli ve sakin bir çalışma köşesi.',
    slot: 'room',
    roomId: 'desk',
    price: 45,
  },
  {
    id: 'room-rainy',
    name: 'Yağmurlu Pencere',
    description: 'Camda ince damlalar, içeride sıcacık çay huzuru.',
    slot: 'room',
    roomId: 'rainy',
    price: 65,
  },
  {
    id: 'room-garden',
    name: 'Bahçe Pikniği',
    description: 'Açık hava, yeşil tepeler ve nefes alan bir mola.',
    slot: 'room',
    roomId: 'garden',
    price: 70,
  },
];

export const MOOD_OPTIONS: Array<{
  level: MoodLevel;
  label: string;
  color: string;
  bg: string;
  reply: string;
}> = [
  {
    level: 'harika',
    label: 'Enerjik',
    color: '#2B6E4F',
    bg: '#E8F5EE',
    reply: 'Bu enerjiyi keyifle taşı! Küçük bir adımla bugünü daha da güzelleştirelim.',
  },
  {
    level: 'sakin',
    label: 'Sakin',
    color: '#3A6B7C',
    bg: '#E8F3F7',
    reply: 'Sakinlik en büyük güç. Acele etmeden, kendi hızında ilerleyelim.',
  },
  {
    level: 'normal',
    label: 'İdare Eder',
    color: '#8C6226',
    bg: '#FCF4E4',
    reply: 'Sıradan günler de çok kıymetli. Tek bir minik görev bile yeter.',
  },
  {
    level: 'yorgun',
    label: 'Yorgun',
    color: '#9C523B',
    bg: '#FCEEE9',
    reply: 'Yorulduysan yükünü hafifletelim. Su içip kısa bir mola versek yeter.',
  },
  {
    level: 'bunaltici',
    label: 'Bunalmış',
    color: '#8A3E4A',
    bg: '#FBECEF',
    reply: 'Buradayım, hiçbir şeye yetişmek zorunda değilsin. İstersen bugünü dinlenme günü yapalım.',
  },
];

export const PET_QUOTES = {
  calm: [
    'Bugün mükemmel olman gerekmiyor, sadece başlaman yeter.',
    'Bir yudum su alıp omuzlarını indirir misin? Ben yanındayım.',
    'Küçük adımlar birikince dağları aşar. İlk adım hangisi olsun?',
  ],
  happy: [
    'Mırrr! Beni okşadığında enerjim hemen doluyor.',
    'Bak, ne güzel bir ritim yakaladık! Kendine de teşekkür et.',
    'Sen iyi hissedince burası da güneş açıyor.',
  ],
  studying: [
    'Ben masada sessizce bekliyorum, sen sadece bu seansa odaklan.',
    'Bildirimler bekleyebilir. Bu dakikalar sadece senin hedefin için.',
    'Harika gidiyorsun! Süre bitince birlikte çay molası verelim.',
  ],
  resting: [
    'Dinlenmek de üretmenin parçası. Bugün sadece nefes alman kâfi.',
    'Seri falan bozulmadı, merak etme. Hazır olduğunda devam ederiz.',
  ],
  celebrating: [
    'İşte bu! Bir küçük adım daha tamamlandı, harikasın!',
    'Pati puanları hesabında! Birlikte büyümek çok güzel.',
  ],
};
