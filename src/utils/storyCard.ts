import type { AppState } from '../types';
import { MOOD_OPTIONS } from '../data/catalog';

/**
 * Exports a 1080x1350 daily companion wellness summary Story PNG.
 */
export function downloadPatiCardPng(state: AppState): void {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#FFF9F2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Warm Banner
  ctx.fillStyle = '#366B51';
  ctx.fillRect(0, 0, canvas.width, 280);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 54px sans-serif';
  ctx.fillText(`PatiDost · ${state.petName}`, 80, 130);

  ctx.fillStyle = '#D8F3DC';
  ctx.font = '600 30px sans-serif';
  ctx.fillText(
    `${state.species === 'cat' ? 'İstanbul Tekiri' : 'Neşeli Saka Kuşu'} · Suçluluk Duygusu Yok, Baskı Yok`,
    80,
    190
  );

  // Energy & Level Summary Cards
  const doneCount = state.tasks.filter((t) => t.done).length;
  const totalFocusMin = state.focusLogs.reduce((acc, f) => acc + f.minutes, 0);
  const lastMood = state.moodEntries[0];
  const moodLabel = lastMood
    ? MOOD_OPTIONS.find((m) => m.level === lastMood.level)?.label ?? lastMood.level
    : 'Sakin';

  const stats = [
    { label: 'Günlük Enerji', value: `${state.todayEnergy} / ${state.energyGoal} XP`, bg: '#EAF3EE', fg: '#214B36' },
    { label: 'Mikro Adım', value: `${doneCount} / ${state.tasks.length}`, bg: '#FDF1EB', fg: '#B84323' },
    { label: 'Odak Süresi', value: `${totalFocusMin} dakika`, bg: '#FDF4E3', fg: '#9B6515' },
    { label: 'Son Hâl Hatır', value: moodLabel, bg: '#F5ECE1', fg: '#2B2118' },
  ];

  stats.forEach((s, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 80 + col * 480;
    const y = 350 + row * 240;

    ctx.fillStyle = s.bg;
    ctx.beginPath();
    ctx.roundRect(x, y, 440, 200, 28);
    ctx.fill();

    ctx.fillStyle = '#6B5849';
    ctx.font = '600 28px sans-serif';
    ctx.fillText(s.label, x + 36, y + 72);

    ctx.fillStyle = s.fg;
    ctx.font = '800 50px sans-serif';
    ctx.fillText(s.value, x + 36, y + 148);
  });

  // Gentle Daily Affirmation Box
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E8DDD0';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(80, 860, 920, 320, 32);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#366B51';
  ctx.font = '700 30px sans-serif';
  ctx.fillText(`${state.petName} diyor ki:`, 130, 935);

  ctx.fillStyle = '#2B2118';
  ctx.font = '600 36px sans-serif';
  const msg = state.restDayActive
    ? 'Bugün dinlenme günü. Hiçbir görevi tamamlamak zorunda değilsin.'
    : 'Küçük adımlar büyük yollar açar. Bugün kendine gösterdiğin özen yeterli.';
  ctx.fillText(msg.slice(0, 44), 130, 1020);
  if (msg.length > 44) {
    ctx.fillText(msg.slice(44, 90), 130, 1075);
  }

  ctx.fillStyle = '#8C7766';
  ctx.textAlign = 'center';
  ctx.font = '600 26px sans-serif';
  ctx.fillText(
    `patidost · ${new Date().toLocaleDateString('tr-TR')} · Yerel Öz-Bakım Arkadaşın`,
    540,
    1275
  );

  const link = document.createElement('a');
  link.download = `patidost-gunun-karti-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
