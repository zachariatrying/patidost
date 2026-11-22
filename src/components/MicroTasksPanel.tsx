import { useState, type FormEvent } from 'react';
import { Check, Plus, Trash2, Layers } from 'lucide-react';
import type { MicroTask } from '../types';
import { TASK_PACKS } from '../data/catalog';

interface MicroTasksPanelProps {
  tasks: MicroTask[];
  restDayActive: boolean;
  onToggleTask: (id: string) => void;
  onAddTask: (title: string) => void;
  onDeleteTask: (id: string) => void;
  onAddPack: (packId: string) => void;
}

export function MicroTasksPanel({
  tasks,
  restDayActive,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onAddPack,
}: MicroTasksPanelProps) {
  const [newTitle, setNewTitle] = useState('');
  const [showPacks, setShowPacks] = useState(false);

  const completedCount = tasks.filter((t) => t.done).length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = newTitle.trim();
    if (!cleaned) return;
    onAddTask(cleaned);
    setNewTitle('');
  };

  return (
    <section
      aria-label="Günün mikro adımları"
      className="rounded-3xl border border-[#E8DDD0] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(43,33,24,0.18)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#2B2118]">Bugünün Mikro Adımları</h2>
          <p className="text-xs text-[#6B5849] mt-0.5">
            {restDayActive
              ? 'Dinlenme günü açık — tek bir minik adım bile fazladan iyilik.'
              : `${completedCount} / ${tasks.length} tamamlandı · Seri cezası yok, sadece ritim.`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPacks((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-[#FFF9F2] px-3 py-1.5 text-xs font-semibold text-[#2B2118] hover:bg-[#F5ECE1] transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-[#D45D3A]" />
          {showPacks ? 'Paketleri Gizle' : 'Hazır Paket Ekle'}
        </button>
      </div>

      {/* Turkish Curated Packs Drawer */}
      {showPacks && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl bg-[#FFF9F2] border border-[#EDE3D7] p-3">
          {TASK_PACKS.map((pack) => (
            <button
              key={pack.id}
              type="button"
              onClick={() => {
                onAddPack(pack.id);
                setShowPacks(false);
              }}
              className="text-left rounded-xl bg-white border border-[#E8DDD0] p-3 hover:border-[#D45D3A] transition-colors cursor-pointer"
            >
              <div className="text-sm font-semibold text-[#2B2118]">{pack.name}</div>
              <div className="text-xs text-[#6B5849] mt-0.5">{pack.tagline}</div>
              <div className="text-[11px] font-semibold text-[#366B51] mt-1.5">
                + {pack.tasks.length} görev ekle
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`group flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-colors ${
              task.done
                ? 'border-[#DCEAE2] bg-[#F4FAF6]'
                : 'border-[#ECE2D6] bg-[#FFFDF9] hover:border-[#D9C7B4]'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggleTask(task.id)}
              aria-pressed={task.done}
              aria-label={task.done ? `${task.title} geri al` : `${task.title} tamamla`}
              className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors cursor-pointer ${
                task.done
                  ? 'border-[#366B51] bg-[#366B51] text-white'
                  : 'border-[#CBBBA9] bg-white hover:border-[#D45D3A]'
              }`}
            >
              {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            <button
              type="button"
              onClick={() => onToggleTask(task.id)}
              className="flex-1 text-left cursor-pointer"
            >
              <span
                className={`block text-sm font-medium ${
                  task.done ? 'line-through text-[#6B5849]' : 'text-[#2B2118]'
                }`}
              >
                {task.title}
              </span>
            </button>

            <span className="shrink-0 rounded-full bg-[#FDF4E3] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#9B6515]">
              +{task.coins} pati
            </span>

            <button
              type="button"
              onClick={() => onDeleteTask(task.id)}
              aria-label={`${task.title} sil`}
              className="shrink-0 rounded-lg p-1.5 text-[#8C7766] opacity-70 hover:opacity-100 hover:bg-[#F5ECE1] hover:text-[#B83B2B] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Add Custom Micro-Task */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Kendine küçük bir adım ekle (örn. 15 sayfa kitap oku)..."
          className="flex-1 rounded-xl border border-[#E2D6C8] bg-[#FFF9F2] px-3.5 py-2.5 text-sm text-[#2B2118] placeholder:text-[#8C7766] focus:border-[#D45D3A] focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#D45D3A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#BC4D2C] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ekle
        </button>
      </form>
    </section>
  );
}
