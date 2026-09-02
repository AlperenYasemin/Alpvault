// src/pages/SharePage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate eklendi
import { db } from "../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

function SharePage() {
  const { shareId } = useParams();
  const navigate = useNavigate(); // Ana sayfaya veya başka bir yere yönlendirme için
  const [status, setStatus] = useState("İndirme bilgileri yükleniyor..."); // Kullanıcıya durum bilgisi

  useEffect(() => {
    if (!shareId) {
      setStatus("Geçersiz paylaşım linki. Ana sayfaya yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/"), 3000); // 3 saniye sonra ana sayfaya yönlendir
      return;
    }

    const triggerDownload = async () => {
      try {
        const linkDocRef = doc(db, "sharedLinks", shareId);
        const linkDocSnap = await getDoc(linkDocRef);

        if (linkDocSnap.exists()) {
          const fileInfo = linkDocSnap.data();
          if (fileInfo.originalFileUrl) {
            setStatus(`'${fileInfo.fileName}' indiriliyor...`);

            // 1. İndirme sayacını artır
            await updateDoc(linkDocRef, {
              downloadCount: increment(1),
            });

            // 2. Dosyayı indirmeyi tetikle
            // Yeni bir sekmede açmak yerine doğrudan indirme için bir <a> elementi oluşturup tıklayalım.
            // Bu, tarayıcının dosyayı göstermeye çalışmasını engelleyebilir.
            const link = document.createElement("a");
            link.href = fileInfo.originalFileUrl;

            // Firebase Storage'a yüklerken Content-Disposition ayarladıysak,
            // tarayıcı bu ismi kullanmaya daha meyilli olur.
            // Ayrıca client tarafında da download attribute'u ekliyoruz.
            link.setAttribute(
              "download",
              fileInfo.fileName || "indirilen_dosya"
            );
            // link.target = '_blank'; // Yeni sekmede açmak istemiyoruz, direkt indirme

            document.body.appendChild(link);
            link.click(); // Linke tıkla
            document.body.removeChild(link); // Linki DOM'dan kaldır

            setStatus(
              `'${fileInfo.fileName}' başarıyla indirildi! Bu pencereyi kapatabilirsiniz veya ana sayfaya dönebilirsiniz.`
            );
            // İsteğe bağlı: Belirli bir süre sonra kullanıcıyı ana sayfaya yönlendirebilirsin
            // setTimeout(() => navigate('/'), 5000);
          } else {
            setStatus(
              "Dosya indirme URL'si bulunamadı. Link geçersiz olabilir."
            );
            setTimeout(() => navigate("/"), 3000);
          }
        } else {
          setStatus(
            "Paylaşım linki bulunamadı veya geçersiz. Ana sayfaya yönlendiriliyorsunuz..."
          );
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (err) {
        console.error("Otomatik indirme sırasında hata:", err);
        setStatus(
          "Dosya indirilirken bir hata oluştu. Lütfen tekrar deneyin veya linkin doğruluğunu kontrol edin."
        );
        setTimeout(() => navigate("/"), 3000);
      }
    };

    triggerDownload();
  }, [shareId, navigate]); // navigate'i dependency array'e ekle

  // Bu sayfa çok kısa bir süre görünecek veya hiç görünmeyecek (tarayıcı hızına bağlı).
  // Kullanıcıya bir geri bildirim vermek yine de iyi bir pratik.
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // Navbar'ı hesaba katarsak
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <p style={{ fontSize: "1.2em", color: "#333" }}>{status}</p>
    </div>
  );
}

export default SharePage;
