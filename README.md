# Etkinlik Portalı 🎉

Organizatörlerin etkinlikler (seminer, konser, atölye) oluşturabildiği ve kullanıcıların bu etkinliklere kayıt olabildiği bir web portalı.

## Özellikler

### Organizatör Özellikleri
- ✅ Yeni etkinlik oluşturma (Seminer, Konser, Atölye)
- ✅ Etkinlik detayları (başlık, açıklama, tarih, konum, kapasite)
- ✅ Etkinlik türüne göre filtreleme

### Kullanıcı Özellikleri
- ✅ Mevcut etkinlikleri görüntüleme
- ✅ Etkinliklere kayıt olma
- ✅ Kayıtlı olunan etkinlikleri görüntüleme
- ✅ Kayıt iptal etme

## Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm

### Kurulum Adımları

1. Projeyi klonlayın:
```bash
git clone https://github.com/Oyaji0102/Etkinlik-Portal-.git
cd Etkinlik-Portal-
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Sunucuyu başlatın:
```bash
npm start
```

4. Tarayıcınızda açın:
```
http://localhost:3000
```

## Kullanım

### Etkinlik Oluşturma
1. "Etkinlik Oluştur" sekmesine gidin
2. Etkinlik bilgilerini doldurun:
   - Etkinlik başlığı (zorunlu)
   - Etkinlik türü: Seminer, Konser veya Atölye (zorunlu)
   - Açıklama (opsiyonel)
   - Tarih ve saat (zorunlu)
   - Konum (opsiyonel)
   - Organizatör adı (zorunlu)
   - Kapasite (opsiyonel)
3. "Etkinlik Oluştur" butonuna tıklayın

### Etkinliğe Kayıt Olma
1. "Etkinlikler" sekmesinde istediğiniz etkinliği bulun
2. "Kayıt Ol" butonuna tıklayın
3. Adınızı ve e-posta adresinizi girin
4. "Kayıt Ol" butonuna tıklayın

### Kayıtlarımı Görüntüleme
1. "Kayıtlarım" sekmesine gidin
2. E-posta adresinizi girin
3. "Kayıtları Göster" butonuna tıklayın
4. Kayıtlı olduğunuz etkinlikleri görüntüleyin
5. İsterseniz "Kaydı İptal Et" ile kaydınızı iptal edebilirsiniz

## API Endpoints

### Etkinlikler (Events)

#### GET /api/events
Tüm etkinlikleri listeler

#### GET /api/events/:id
Belirli bir etkinliği getirir

#### POST /api/events
Yeni etkinlik oluşturur

Request body:
```json
{
  "title": "Örnek Seminer",
  "type": "seminer",
  "description": "Açıklama",
  "date": "2024-01-20T14:00",
  "location": "İstanbul",
  "organizerName": "Ahmet Yılmaz",
  "capacity": 50
}
```

#### PUT /api/events/:id
Etkinliği günceller

#### DELETE /api/events/:id
Etkinliği siler

### Kayıtlar (Registrations)

#### GET /api/registrations/event/:eventId
Bir etkinliğin tüm kayıtlarını listeler

#### GET /api/registrations/user/:email
Bir kullanıcının tüm kayıtlarını listeler

#### POST /api/registrations
Yeni kayıt oluşturur

Request body:
```json
{
  "eventId": "event-uuid",
  "userName": "Ayşe Demir",
  "userEmail": "ayse@example.com"
}
```

#### DELETE /api/registrations/:id
Kaydı iptal eder

## Teknolojiler

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Veri Depolama:** JSON dosyaları
- **Paket Yönetimi:** npm

## Proje Yapısı

```
Etkinlik-Portal-/
├── data/               # Veri depolama katmanı
│   ├── storage.js      # Veri işlemleri
│   ├── events.json     # Etkinlik verileri
│   └── registrations.json # Kayıt verileri
├── routes/             # API route'ları
│   ├── events.js       # Etkinlik endpoint'leri
│   └── registrations.js # Kayıt endpoint'leri
├── public/             # Frontend dosyaları
│   ├── index.html      # Ana sayfa
│   ├── styles.css      # Stil dosyası
│   └── app.js          # Frontend JavaScript
├── server.js           # Ana sunucu dosyası
├── package.json        # Proje bağımlılıkları
└── README.md          # Dokümantasyon
```

## Lisans

ISC
