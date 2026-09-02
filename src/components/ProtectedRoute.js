// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    return <Navigate to="/login" replace />;
    // 'replace' prop'u, tarayıcı geçmişinde yönlendirme yapılan sayfayı tutmaz.
    // Böylece kullanıcı geri tuşuna bastığında tekrar korumalı sayfaya dönmeye çalışmaz.
  }

  // Kullanıcı giriş yapmışsa, bu Route'un altında tanımlanan asıl komponenti göster.
  // Eğer Route'ları iç içe (nested) kullanıyorsan <Outlet /> kullanmak daha uygun olur.
  // Direkt bir komponenti koruyorsan, props olarak gelen 'element'i render edebilirsin.
  // Şimdilik App.js'deki kullanımımıza göre <Outlet /> daha genel bir çözüm olacak.
  // Ancak App.js'de element={<HomePage />} dediğimiz için direkt children render edebiliriz.
  // Biz element prop'u ile gelen component'i render edelim.
  // VEYA daha genel bir yaklaşım için, App.js'deki Route tanımını değiştireceğiz.

  // Önceki App.js tanımına göre: Eğer Route'u şu şekilde kullanırsak:
  // <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
  // O zaman burada 'children' prop'unu kullanırız:
  // return children;

  // Veya App.js'de şu şekilde kullanırsak (daha yaygın):
  // <Route path='/' element={<ProtectedRoute />}>
  //   <Route index element={<HomePage />} /> // ya da path=''
  // </Route>
  // O zaman burada <Outlet /> kullanırız:
  return <Outlet />;
}

export default ProtectedRoute;
