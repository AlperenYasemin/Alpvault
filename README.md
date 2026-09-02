# 🗃️ AlpVault

<div align="center">

![AlpVault Logo](https://img.shields.io/badge/AlpVault-Cloud%20Storage-blue?style=for-the-badge&logo=cloud&logoColor=white)

**Modern, güvenli ve kullanıcı dostu bulut depolama platformu**

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.6.1-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Demo](https://alpvault.vercel.app) • [Documentation](docs/) • [Report Bug](issues/) • [Request Feature](issues/)

</div>

---

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🛠️ Teknoloji Stack](#️-teknoloji-stack)
- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [⚙️ Kurulum](#️-kurulum)
- [🔧 Konfigürasyon](#-konfigürasyon)
- [📱 Kullanım](#-kullanım)
- [🏗️ Proje Yapısı](#️-proje-yapısı)
- [🔒 Güvenlik](#-güvenlik)
- [🚢 Deployment](#-deployment)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)
- [📞 İletişim](#-iletişim)

---

## 🎯 Proje Hakkında

**AlpVault**, kullanıcıların dosyalarını güvenli bir şekilde depolayabileceği, organize edebileceği ve kolayca paylaşabileceği modern bir bulut depolama platformudur. React 19 ve Firebase teknolojilerini kullanarak geliştirilmiş, kullanıcı dostu arayüzü ve güçlü özellikleri ile öne çıkan bir web uygulamasıdır.

### 🎨 Tasarım Felsefesi

- **Minimalist & Modern:** Clean ve sezgisel kullanıcı arayüzü
- **Erişilebilirlik:** WCAG standartlarına uygun tasarım
- **Responsive:** Tüm cihazlarda mükemmel deneyim
- **Performance:** Hızlı ve optimize edilmiş kullanıcı deneyimi

---

## ✨ Özellikler

### 🔐 **Kimlik Doğrulama**

- Firebase Authentication ile güvenli giriş/kayıt
- E-posta/şifre tabanlı authentication
- Otomatik oturum yönetimi
- Protected routes ile güvenli erişim

### 📁 **Dosya Yönetimi**

- **Drag & Drop Upload:** Sürükle-bırak ile kolay dosya yükleme
- **Klasör Sistemi:** Hiyerarşik klasör organizasyonu
- **Real-time Progress:** Yükleme ilerlemesi takibi
- **File Operations:** İndirme, silme, yeniden adlandırma
- **Bulk Operations:** Toplu dosya işlemleri

### 🔗 **Paylaşım Sistemi**

- **Güvenli Linkler:** UUID tabanlı benzersiz paylaşım linkleri
- **Download Tracking:** İndirme sayısı takibi
- **Link Management:** Paylaşım linklerini yönetme
- **One-click Sharing:** Tek tıkla paylaşım

### 🎨 **Kullanıcı Deneyimi**

- **Dark/Light Theme:** Dinamik tema değiştirme
- **Animated Background:** Pexels API ile canlı arka plan
- **Responsive Design:** Mobil-first yaklaşım
- **Smooth Animations:** Akıcı geçişler ve mikro-animasyonlar

### 🔄 **Real-time Features**

- Canlı dosya listesi güncellemeleri
- Gerçek zamanlı upload progress
- Instant feedback sistem

---

## 🛠️ Teknoloji Stack

### Frontend

```
React 19.1.0          - UI Library
React Router DOM 7.5.3 - Routing
React DnD 16.0.1      - Drag & Drop
Context API           - State Management
CSS3                  - Styling
```

### Backend & Services

```
Firebase Auth 11.6.1  - Authentication
Firestore            - Database
Firebase Storage     - File Storage
Pexels API          - Background Images
```

### Development Tools

```
Create React App     - Build Tool
ESLint              - Code Linting
Prettier            - Code Formatting
Git                 - Version Control
```

---

## 🚀 Hızlı Başlangıç

### Önkoşullar

- **Node.js** (v16 veya üstü)
- **npm** veya **yarn**
- **Firebase** projesi
- **Git**

### Hızlı Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/yourusername/alpvault.git

# Proje dizinine geçin
cd alpvault

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env.local

# Firebase konfigürasyonunu yapın
# (Detaylar için Konfigürasyon bölümüne bakın)

# Uygulamayı başlatın
npm start
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

---

## ⚙️ Kurulum

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/yourusername/alpvault.git
cd alpvault
```

### 2. Bağımlılıkları Yükleyin

```bash
# npm kullanarak
npm install

# veya yarn kullanarak
yarn install
```

### 3. Firebase Projesi Oluşturun

1. [Firebase Console](https://console.firebase.google.com/) 'a gidin
2. Yeni bir proje oluşturun
3. Authentication, Firestore, Storage servislerini aktifleştirin

### 4. Environment Variables Ayarlayın

`.env.local` dosyası oluşturun:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_PEXELS_API_KEY=your_pexels_api_key
```

### 5. Firebase Security Rules

**Firestore Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /files/{fileId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }

    match /folders/{folderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }

    match /sharedLinks/{linkId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /files/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🔧 Konfigürasyon

### Firebase Konfigürasyonu

`src/firebase.js` dosyasını güncelleyin:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
```

### Pexels API

Pexels API anahtarınızı [Pexels](https://www.pexels.com/api/) adresinden alın ve environment variable olarak ekleyin.

### Theme Konfigürasyonu

`src/contexts/ThemeContext.js` dosyasından tema renklerini özelleştirebilirsiniz:

```javascript
export const themes = {
  dark: {
    background: "#18191a",
    surface: "#23272f",
    primary: "#1976d2",
    // ... diğer renkler
  },
  light: {
    background: "#f5f5f5",
    surface: "#ffffff",
    primary: "#1976d2",
    // ... diğer renkler
  },
};
```

---

## 📱 Kullanım

### Temel İşlemler

#### 1. Hesap Oluşturma & Giriş

```
1. Ana sayfaya gidin
2. "Kayıt Ol" butonuna tıklayın
3. E-posta ve şifre girin
4. Hesabınız otomatik olarak oluşturulur
```

#### 2. Dosya Yükleme

```
1. Dashboard'a gidin
2. Dosyalarınızı sürükleyip bırakın
3. Veya "Dosya Seç" butonunu kullanın
4. Yükleme ilerlemesini takip edin
```

#### 3. Klasör Oluşturma

```
1. "Yeni Klasör" butonuna tıklayın
2. Klasör adını girin
3. Klasör otomatik olarak oluşturulur
```

#### 4. Dosya Paylaşımı

```
1. Paylaşmak istediğiniz dosyaya sağ tıklayın
2. "Paylaş" seçeneğini seçin
3. Oluşturulan linki kopyalayın
4. Linki istediğiniz kişiyle paylaşın
```

### Gelişmiş Özellikler

#### Drag & Drop Organizasyon

- Dosyaları klasörler arasında sürükleyip bırakabilirsiniz
- Klasörleri de organize edebilirsiniz
- Visual feedback ile kolay kullanım

#### Tema Değiştirme

- Sağ üst köşedeki tema butonuna tıklayın
- Dark/Light tema arasında geçiş yapın
- Tercih otomatik olarak kaydedilir

---

## 🏗️ Proje Yapısı

```
alpvault/
├── public/                 # Public dosyalar
│   ├── index.html
│   └── manifest.json
├── src/                   # Kaynak kodlar
│   ├── components/        # React bileşenleri
│   │   ├── FileList.js
│   │   ├── FileUpload.js
│   │   ├── Navbar.js
│   │   ├── ProtectedRoute.js
│   │   ├── ThemeToggle.js
│   │   └── PexelsPhotoWall.js
│   ├── contexts/          # Context providers
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── pages/            # Sayfa bileşenleri
│   │   ├── LoginPage.js
│   │   ├── SignupPage.js
│   │   └── SharePage.js
│   ├── App.js            # Ana uygulama
│   ├── firebase.js       # Firebase konfigürasyonu
│   ├── index.js          # Entry point
│   └── *.css            # Stil dosyaları
├── Collage Photos/       # Demo fotoğraflar
├── package.json          # Dependencies
├── PRD.md               # Product Requirements Document
└── README.md            # Bu dosya
```

### Bileşen Mimarisi

```
App
├── ThemeProvider
│   ├── AuthProvider
│   │   ├── Navbar
│   │   └── Router
│   │       ├── ProtectedRoute
│   │       │   └── FileList
│   │       ├── LoginPage
│   │       ├── SignupPage
│   │       └── SharePage
```

---

## 🔒 Güvenlik

### İmplementasyonlar

- **Firebase Security Rules** ile veri koruması
- **Input validation** ve sanitization
- **HTTPS** zorunlu kullanım
- **Content-Type** validasyonu
- **User data isolation**

### En İyi Uygulamalar

- Environment variables kullanımı
- Client-side validation
- Secure file upload handling
- Protected routes implementation

### Güvenlik Kontrol Listesi

- [ ] Firebase Security Rules aktif
- [ ] Environment variables set
- [ ] HTTPS redirect enabled
- [ ] Input validation implemented
- [ ] File type restrictions active

---

## 🚢 Deployment

### Vercel (Önerilen)

```bash
# Vercel CLI yükleyin
npm i -g vercel

# Deploy edin
vercel

# Environment variables ekleyin
vercel env add REACT_APP_FIREBASE_API_KEY
```

### Netlify

```bash
# Build edin
npm run build

# Build klasörünü Netlify'a yükleyin
# Environment variables ekleyin
```

### Firebase Hosting

```bash
# Firebase CLI yükleyin
npm install -g firebase-tools

# Login olun
firebase login

# Projeyi init edin
firebase init hosting

# Deploy edin
firebase deploy
```

### Environment Variables (Production)

Production ortamında aşağıdaki environment variables'ları ekleyin:

```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_PEXELS_API_KEY
```

---

## 🧪 Testing

### Test Scripts

```bash
# Unit testleri çalıştır
npm test

# Coverage raporu
npm run test:coverage

# E2E testler
npm run test:e2e
```

### Test Yapısı

```
src/
├── __tests__/           # Test dosyaları
├── components/
│   └── __tests__/       # Component testleri
└── utils/
    └── __tests__/       # Utility testleri
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen aşağıdaki adımları takip edin:

### Geliştirme Süreci

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** edin (`git commit -m 'Add amazing feature'`)
4. **Push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### Kod Standartları

- ESLint kurallarına uyun
- Prettier formatting kullanın
- Component'lar için JSDoc yazın
- Test coverage %80+ tutun

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Örnek:

```
feat(auth): add password reset functionality

- Add password reset form
- Integrate with Firebase Auth
- Add email validation

Closes #123
```

### Issue Reporting

Bug bulduğunuzda veya feature isteğiniz olduğunda:

1. [Issues](https://github.com/yourusername/alpvault/issues) sayfasına gidin
2. Template'leri kullanın
3. Detaylı açıklama yazın
4. Screenshots ekleyin (gerekirse)

---

## 📊 Performance

### Metrics

- **Lighthouse Score:** 90+
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

### Optimizasyonlar

- Code splitting ile lazy loading
- Image optimization
- Bundle size minimization
- Caching strategies

---

## 🐛 Bilinen Sorunlar

- [ ] Büyük dosyalar (>100MB) için upload timeout
- [ ] Safari'de drag-drop animation glitch
- [ ] Mobile Safari'de file input limitation

### Workarounds

Bu sorunlar için geçici çözümler ve iyileştirmeler üzerinde çalışılıyor.

---

## 📈 Roadmap

### v1.1 (Q1 2024)

- [ ] Advanced search functionality
- [ ] File versioning
- [ ] Bulk operations improvement

### v1.2 (Q2 2024)

- [ ] Team collaboration features
- [ ] Real-time notifications
- [ ] Mobile app (React Native)

### v2.0 (Q3 2024)

- [ ] AI-powered file organization
- [ ] Advanced analytics
- [ ] Enterprise features

---

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

```
MIT License

Copyright (c) 2024 AlpVault

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Teşekkürler

- [React](https://reactjs.org/) - UI Library
- [Firebase](https://firebase.google.com/) - Backend Services
- [Pexels](https://www.pexels.com/) - Beautiful Photos
- [React DnD](https://react-dnd.github.io/react-dnd/) - Drag & Drop
- Tüm [katkıda bulunanlar](CONTRIBUTORS.md)

---

## 📞 İletişim

- **Email:** support@alpvault.com
- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Twitter:** [@alpvault](https://twitter.com/alpvault)
- **Website:** [alpvault.com](https://alpvault.com)

---

<div align="center">

**AlpVault ile dosyalarınız güvende! 🔒**

Made with ❤️ in Turkey

[⬆ Başa Dön](#-alpvault)

</div>
