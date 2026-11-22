# PatiDost — iOS & Android Mobil Uygulama Lansman Planı

**Paket Kimliği (Bundle ID / Application ID):** `com.patidost.app`  
**Mimari:** Capacitor 7 (React 19 + Vite + Sıcak Kağıt/Karamel Tasarım + Web Audio Çan + 1080x1350 PNG Kart İhracı)  
**Hedef Pazar:** Türkiye & Global DEHB / Odaklanma / Şefkatli Alışkanlık Kullanıcıları

---

## 1. Mağaza Görselleri ve Marka Kimliği

- **Uygulama İkonu (`1024x1024`):** `public/store-assets/patidost_icon.png` — Sıcak Karamel (`#EA580C`) ve krem kağıt (`#FFFBF5`) üzerinde gülen pati/dost maskot amblemi.
- **Tanıtım Banner (`1600x900`):** `public/store-assets/patidost_promo.png` — Mikro adım yöneticisi, odak zamanlayıcı, 4-4-4-4 nefes rehberi ve 7 günlük duygu analitiği.

---

## 2. Capacitor 7 Yerel Entegrasyon Mimarisi

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm install @capacitor/local-notifications @capacitor/haptics @capacitor/share @capacitor/filesystem
npx cap init "PatiDost" "com.patidost.app" --web-dir dist
npx cap add ios && npx cap add android
```

### Eklenti Eşlemesi
| Web Özelliği | Capacitor 7 Doğal API | Kullanım Amacı |
| :--- | :--- | :--- |
| Şefkatli Hatırlatmalar | `@capacitor/local-notifications` | Suçluluk hissettirmeyen yumuşak odak & nefes hatırlatıcıları |
| Nefes Ritmi Dokunuşu | `@capacitor/haptics` | 4-4-4-4 / 4-7-8 nefes geçişlerinde göz kapalı takip için hafif titreşim |
| Günün Kartı PNG Paylaşımı | `@capacitor/share` + `@capacitor/filesystem` | `downloadPatiCardPng` çıktısını doğrudan Instagram Stories / WhatsApp'a aktarma |
| Arka Plan Ses & Çan | Native Media / Web Audio | Ekran kilitliyken dahi odak bitiş zilinin nazikçe çalması |

---

## 3. Doğal İzinler (`Info.plist` & `AndroidManifest.xml`)

### iOS (`ios/App/App/Info.plist`)
- `NSPhotoLibraryAddUsageDescription`: *"Günün özet kartını fotoğraf arşivinize kaydetmek için izin gerekir."*
- *(Opsiyonel kullanıcı isteğiyle)* Bildirim izni — yalnızca kullanıcı "Nazik Hatırlatma" açtığında istenir.

### Android (`android/app/src/main/AndroidManifest.xml`)
- `android.permission.POST_NOTIFICATIONS` (Android 13+ yerel odak bildirimi)
- `android.permission.VIBRATE` (Nefes & odak bitişi hafif dokunsal geri bildirim)

---

## 4. App Store & Google Play Uyumluluk Kapıları

1. **Apple Guideline 5.1.1(v) — Hesapsız Tam Kullanım & Veri Silme:**
   - PatiDost sıfır kayıt (no-login) felsefesiyle başlar; tüm günlükler, adımlar ve ruh hali kayıtları cihaz içinde tutulur.
   - KVKK / Veri Kontrolü penceresinden tek tıkla JSON yedekleme, geri yükleme ve kalıcı silme yapılabilir.
2. **Ruh Sağlığı & Güvenlik Çerçevesi:**
   - PatiDost klinik terapi veya tıbbi tedavi yerine geçmez; odak, nefes düzenleme ve pozitif pekiştirme (positive reinforcement) aracıdır.
3. **Çocuk / Genç Dostu Güvenli İçerik:**
   - Reklam yok, karanlık kalıplar (dark patterns / streak punishment) yok.

---

## 5. Türkçe ASO (App Store Optimization) & Gelir Modeli

- **Başlık (30 kr):** `PatiDost: Odak, Nefes & Adım`
- **Alt Başlık (30 kr):** `Şefkatli DEHB ve Alışkanlık`
- **Anahtar Kelimeler (100 kr):** `dehb,odak,pomodoro,nefes,alışkanlık,günlük,sakinlik,stres,adım,planlayıcı,wellness,ruh hali`

### RevenueCat / TL PPP Fiyatlandırma Katmanları
| Katman | Fiyat (TRY) | Kapsam |
| :--- | :--- | :--- |
| **Ücretsiz (Dostum)** | ₺0 | Sınırsız mikro adım, Odak sayacı, 4-4-4-4 / 4-7-8 nefes, 7 günlük özet, PNG kart |
| **PatiDost Sıcak Yuva (Aylık)** | ₺39,99 / ay | Özel pati temaları, 30/90 günlük duygu analitiği, sınırsız ortam sesleri |
| **PatiDost Sıcak Yuva (Yıllık)** | ₺299,99 / yıl | %37 indirim + yeni maskot kostümleri ve widget paketleri |

---

## 6. 6 Haftalık Lansman Yol Haritası

| Hafta | Odak | Çıktı |
| :--- | :--- | :--- |
| **Hafta 1** | Capacitor 7 & Haptics | iOS/Android sarmalayıcı + nefes fazı dokunsal titreşimleri |
| **Hafta 2** | Yerel Bildirim & Widgetlar | Suçluluksuz günlük mikro-adım bildirimi & iOS WidgetKit hazırlığı |
| **Hafta 3** | Store Görselleri & Animasyonlar | 1024x1024 pati ikonu, 4-tab ekran görüntüleri |
| **Hafta 4** | Topluluk Beta Testi | DEHB / odak odaklı 20 test kullanıcısı ile geri bildirim turu |
| **Hafta 5** | KVKK & App Store Hazırlığı | Offline-first kanıt videosu & gizlilik beyanı |
| **Hafta 6** | Lansman | App Store & Google Play yayını |
