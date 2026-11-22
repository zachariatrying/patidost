# PatiDost

Şefkatli DEHB, odak zamanlayıcı, rehberli nefes (4-4-4-4 Kutu ve 4-7-8 Sakin), 7 günlük özet ve Günün Kartı PNG paylaşımı sunan günlük alışkanlık uygulaması.

## 🌐 Web'de Kullan

- **Canlı Adres:** https://zachariatrying.github.io/patidost/
- **Telefona PWA Olarak Ekleme:** Mobil tarayıcınızda **Ana Ekrana Ekle** seçeneğini kullanarak çevrimdışı destekli uygulama gibi açabilirsiniz.

## 📱 Android APK İndir & Kur

1. [Build Android APK & Play AAB](https://github.com/zachariatrying/patidost/actions/workflows/android-apk.yml) sayfasına gidin.
2. En üstteki yeşil (başarılı) iş akışı koşusuna tıklayın.
3. Sayfanın en altındaki **Artifacts** bölümünden **`patidost-debug-apk`** dosyasını indirin.
4. İnen `.zip` dosyasını açıp içindeki `app-debug.apk` dosyasını Android telefonunuza aktarın.
5. Android'de **Bilinmeyen kaynaklardan uygulama yükleme** iznini verip kurulumu tamamlayın.

> Google Play Store için aynı sayfada **`patidost-release-aab`** (`app-release.aab`, R8 küçültmeli) paketi de üretilmektedir.

## ✨ Öne Çıkan Özellikler

- **4 Sekmeli Mobil Arayüz:** `Adımlar`, `Odak`, `Nefes` ve `Günlük`.
- **Rehberli Nefes Egzersizleri:** 4-4-4-4 Kutu ve 4-7-8 Sakin modları (3 turda +15 XP ve +15 pati).
- **7 Günlük Şefkatli Özet & Günün Kartı PNG:** Haftalık ilerleme grafiği ve `1080x1350` paylaşılabilir özet kartı.
- **KVKK Veri Kontrolü:** Hesapsız kullanım, JSON yedekleme/içe aktarım ve 2 adımlı tam veri silme.

## 🛠️ Yerel Geliştirme & Mobil Derleme

```bash
npm install
npm run dev        # Yerel geliştirme sunucusu
npm run build      # Üretim derlemesi (dist/)
npx cap sync       # Android & iOS projelerini güncelleme
```
