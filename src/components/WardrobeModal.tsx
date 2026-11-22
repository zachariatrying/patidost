import { X, Check, Lock } from 'lucide-react';
import type { AccessorySlot, CosmeticItem, RoomId } from '../types';
import { COSMETIC_ITEMS } from '../data/catalog';

interface WardrobeModalProps {
  open: boolean;
  coins: number;
  ownedItems: string[];
  activeRoom: RoomId;
  equipped: {
    head: string | null;
    neck: string | null;
    desk: string | null;
  };
  onClose: () => void;
  onBuyOrEquip: (item: CosmeticItem) => void;
  onUnequipSlot: (slot: AccessorySlot) => void;
}

const SECTIONS: Array<{ title: string; slot: AccessorySlot | 'room' }> = [
  { title: 'Kafa Aksesuarları', slot: 'head' },
  { title: 'Boyun & Stil', slot: 'neck' },
  { title: 'Masa Köşesi', slot: 'desk' },
  { title: 'Oda & Pencere Manzaraları', slot: 'room' },
];

export function WardrobeModal({
  open,
  coins,
  ownedItems,
  activeRoom,
  equipped,
  onClose,
  onBuyOrEquip,
  onUnequipSlot,
}: WardrobeModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2118]/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="PatiDost Atölye ve Gardırop"
    >
      <div className="w-full max-w-2xl max-h-[86vh] flex flex-col rounded-3xl border border-[#E8DDD0] bg-[#FFF9F2] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EDE3D7]">
          <div>
            <h2 className="text-xl font-bold text-[#2B2118]">PatiDost Atölyesi</h2>
            <p className="text-xs text-[#6B5849]">
              Görev ve odaklanma seanslarıyla kazandığın pati puanlarıyla odanı ve dostunu süsle.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#FDF4E3] border border-[#F0D9AA] px-3.5 py-1 text-sm font-bold tabular-nums text-[#9B6515]">
              {coins} pati
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Atölyeyi kapat"
              className="rounded-full p-2 text-[#6B5849] hover:bg-[#F5ECE1] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {SECTIONS.map((section) => {
            const items = COSMETIC_ITEMS.filter((item) => item.slot === section.slot);
            const equippedInSlot = section.slot !== 'room' ? equipped[section.slot] : null;

            return (
              <div key={section.slot}>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-[#2B2118]">{section.title}</h3>
                  {section.slot !== 'room' && equippedInSlot && (
                    <button
                      type="button"
                      onClick={() => onUnequipSlot(section.slot as AccessorySlot)}
                      className="text-xs font-semibold text-[#D45D3A] hover:underline cursor-pointer"
                    >
                      Çıkar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((item) => {
                    const owned = ownedItems.includes(item.id) || item.price === 0;
                    const isEquipped =
                      item.slot === 'room'
                        ? activeRoom === item.roomId
                        : equipped[item.slot] === item.id;
                    const canAfford = coins >= item.price;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={!owned && !canAfford}
                        onClick={() => onBuyOrEquip(item)}
                        className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-colors ${
                          isEquipped
                            ? 'border-[#366B51] bg-[#EAF3EE]'
                            : owned
                              ? 'border-[#E8DDD0] bg-white hover:border-[#D45D3A] cursor-pointer'
                              : canAfford
                                ? 'border-[#E8DDD0] bg-white hover:border-[#B7791F] cursor-pointer'
                                : 'border-[#EDE3D7] bg-[#F7F1E9] opacity-65 cursor-not-allowed'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-[#2B2118]">{item.name}</span>
                            {isEquipped ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#366B51] px-2 py-0.5 text-[11px] font-semibold text-white">
                                <Check className="w-3 h-3" /> Kullanılıyor
                              </span>
                            ) : owned ? (
                              <span className="text-[11px] font-semibold text-[#366B51]">Tak / Seç</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF4E3] px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#9B6515]">
                                {!canAfford && <Lock className="w-3 h-3" />}
                                {item.price} pati
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6B5849] mt-1">{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
