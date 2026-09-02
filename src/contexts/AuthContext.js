// src/contexts/AuthContext.js

import React, { useContext, useState, useEffect } from "react";
// React'ten temel hook'ları ve context oluşturma aracını alıyoruz.
// useContext: Context'teki veriyi kullanmamızı sağlar.
// useState: Komponent içinde durum (state) tutmamızı sağlar.
// useEffect: Komponentin yaşam döngüsüyle ilgili yan etkileri (örneğin API isteği, abonelik) yönetmemizi sağlar.

import { auth } from "../firebase"; // Daha önce src/firebase.js'de oluşturduğumuz Firebase auth objesini alıyoruz.

// Firebase Authentication servisinden ihtiyacımız olan fonksiyonları import ediyoruz:
import {
  createUserWithEmailAndPassword, // Yeni kullanıcı oluşturmak için
  signInWithEmailAndPassword, // Mevcut kullanıcıyla giriş yapmak için
  signOut, // Kullanıcının çıkış yapması için
  onAuthStateChanged, // Kullanıcının giriş/çıkış durumundaki değişiklikleri dinlemek için
} from "firebase/auth";

// 1. Context'i Oluşturma:
// Bu, diğer komponentlerin erişebileceği global veri deposunu oluşturur.
const AuthContext = React.createContext();

// 2. `useAuth` Hook'u Oluşturma (Kolay Erişim İçin):
// Bu özel bir hook (fonksiyon). Diğer komponentler bu hook'u çağırarak
// AuthContext içindeki verilere (currentUser, login fonksiyonu vb.) kolayca erişebilecekler.
export function useAuth() {
  return useContext(AuthContext);
}

// 3. `AuthProvider` Komponenti Oluşturma:
// Bu komponent, tüm uygulamamızı saracak (kaplayacak).
// Görevi, AuthContext aracılığıyla kimlik bilgilerini ve fonksiyonlarını
// altındaki tüm komponentlere (yani tüm uygulamaya) sağlamaktır.
export function AuthProvider({ children }) {
  // children: AuthProvider'ın içine yazılan diğer komponentleri temsil eder (örneğin <App /> komponentimiz).

  // State'lerimizi tanımlıyoruz:
  const [currentUser, setCurrentUser] = useState(null); // Giriş yapmış kullanıcıyı tutar. Başlangıçta null (kimse giriş yapmamış).
  const [loading, setLoading] = useState(true); // Kimlik durumu kontrol edilirken bir yükleme durumu. Başlangıçta true.

  // ---- Kimlik Doğrulama Fonksiyonlarımız ----

  // Yeni Kullanıcı Kayıt Fonksiyonu
  function signup(email, password) {
    // Firebase'in createUserWithEmailAndPassword fonksiyonunu kullanarak yeni kullanıcı oluşturur.
    // Bu fonksiyon bir Promise döndürür (asenkron bir işlemin sonucunu temsil eder).
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Mevcut Kullanıcıyla Giriş Fonksiyonu
  function login(email, password) {
    // Firebase'in signInWithEmailAndPassword fonksiyonunu kullanarak giriş yapar.
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Kullanıcı Çıkış Fonksiyonu
  function logout() {
    // Firebase'in signOut fonksiyonunu kullanarak kullanıcının oturumunu sonlandırır.
    return signOut(auth);
  }

  // ---- Kullanıcının Oturum Durumunu Dinleme ----
  // useEffect hook'u, komponent ilk render edildiğinde (veya bağımlılıkları değiştiğinde) çalışır.
  // Buradaki boş bağımlılık dizisi `[]`, bu useEffect'in sadece komponent ilk yüklendiğinde
  // bir kere çalışmasını sağlar.
  useEffect(() => {
    // onAuthStateChanged, Firebase Authentication servisinden bir fonksiyondur.
    // Kullanıcının giriş yapma, çıkış yapma gibi kimlik durumu değişikliklerini dinler.
    // Bir kullanıcı durumu değiştiğinde (user parametresi ile gelir), içindeki fonksiyonu çalıştırır.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Gelen kullanıcı bilgisini (giriş yapmışsa user objesi, çıkış yapmışsa null) currentUser state'ine atar.
      setLoading(false); // Kimlik durumu belirlendiği için yükleme durumunu false yaparız.
    });

    // useEffect'in return ettiği fonksiyon, komponent DOM'dan kaldırıldığında (unmount) çalışır.
    // Bu, onAuthStateChanged dinleyicisini temizler. Bu önemlidir, çünkü dinleyiciyi
    // temizlemezsek bellek sızıntılarına veya beklenmedik davranışlara yol açabilir.
    return unsubscribe;
  }, []); // Boş bağımlılık dizisi, sadece bir kere çalışmasını sağlar.

  // ---- Context Üzerinden Paylaşılacak Değerler ----
  // Bu `value` objesi, AuthContext.Provider aracılığıyla alt komponentlere aktarılacak
  // verileri ve fonksiyonları içerir.
  const value = {
    currentUser, // Giriş yapmış kullanıcı bilgisi
    signup, // Kayıt fonksiyonu
    login, // Giriş fonksiyonu
    logout, // Çıkış fonksiyonu
  };

  // ---- Provider'ın Render Ettiği Kısım ----
  // AuthContext.Provider, value prop'u ile yukarıda tanımladığımız `value` objesini alır.
  // Bu sayede, AuthProvider ile sarılmış tüm çocuk komponentler (`children`)
  // `useAuth()` hook'u aracılığıyla bu `value` objesine erişebilir.
  // `!loading && children` ifadesi: Sadece `loading` durumu `false` olduğunda (yani ilk kimlik kontrolü bittiğinde)
  // çocuk komponentlerin (uygulamanın geri kalanının) render edilmesini sağlar. Bu, ilk yüklemede
  // kullanıcı durumu henüz belli olmadan sayfanın anlamsızca değişmesini önler.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
