// src/components/FileUpload.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Kullanıcı bilgilerini almak için
import { storage, db } from "../firebase"; // Firebase Storage ve Firestore bağlantıları
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Storage fonksiyonları
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore fonksiyonları

function FileUpload({ currentFolderId }) {
  const [file, setFile] = useState(null); // Seçilen dosyayı tutacak state
  const [progress, setProgress] = useState(0); // Yükleme yüzdesini tutacak state
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Başarı veya bilgi mesajları için
  const { currentUser } = useAuth(); // Giriş yapmış kullanıcıyı al

  // Dosya seçildiğinde bu fonksiyon çalışır
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(""); // Önceki hatayı temizle
      setMessage(""); // Önceki mesajı temizle
    }
  };

  // Dosyayı yükleme butonu tıklandığında bu fonksiyon çalışır
  const handleUpload = async () => {
    if (!file) {
      setError("Lütfen önce bir dosya seçin.");
      return;
    }
    if (!currentUser) {
      setError("Dosya yüklemek için giriş yapmalısınız.");
      return;
    }

    setError("");
    setMessage("Yükleniyor...");
    setProgress(0);

    const storagePath = `files/${currentUser.uid}/${file.name}`;
    const storageRef = ref(storage, storagePath);

    // YENİ: Metadata objesi oluştur (Content-Disposition ayarı için)
    const metadata = {
      contentType: file.type, // Dosyanın MIME türü
      contentDisposition: `attachment; filename=\"${file.name}\"`, // Tarayıcıya indirmesini söyler
    };

    // Dosyayı yükleme işlemini başlat ve metadata'yı ekle
    const uploadTask = uploadBytesResumable(storageRef, file, metadata); // metadata BURAYA EKLENDİ

    // Yükleme durumunu dinle
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Yükleme ilerlemesini hesapla
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (uploadError) => {
        // Yükleme sırasında bir hata olursa
        console.error("Dosya Yükleme Hatası:", uploadError);
        let userFriendlyError = "Dosya yüklenirken bir hata oluştu.";
        switch (uploadError.code) {
          case "storage/unauthorized":
            userFriendlyError =
              "Dosya yükleme yetkiniz yok. Lütfen Storage kurallarınızı kontrol edin.";
            break;
          case "storage/canceled":
            userFriendlyError = "Dosya yükleme işlemi iptal edildi.";
            break;
          case "storage/unknown":
            userFriendlyError =
              "Bilinmeyen bir hata oluştu, lütfen tekrar deneyin.";
            break;
          default:
            userFriendlyError = `Hata: ${uploadError.message}`;
            break;
        }
        setError(userFriendlyError);
        setProgress(0);
        setMessage("");
      },
      async () => {
        // Yükleme başarıyla tamamlandığında
        try {
          // Yüklenen dosyanın indirme URL'sini al
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Dosya bilgilerini Firestore'a kaydet
          await addDoc(collection(db, "files"), {
            name: file.name,
            url: downloadURL,
            path: storagePath, // Storage'daki tam yolu
            size: file.size,
            type: file.type, // Orijinal MIME type
            ownerId: currentUser.uid,
            folderId: currentFolderId || null,
            createdAt: serverTimestamp(),
          });
          setMessage(`'${file.name}' başarıyla yüklendi.`);
          setFile(null); // Seçili dosyayı temizle
          setProgress(100);
        } catch (dbError) {
          console.error("Firestore Kayıt Hatası:", dbError);
          setError(
            "Dosya yüklendi ancak veritabanına kaydedilirken bir sorun oluştu."
          );
          setMessage("");
          setProgress(100); // Hata olsa da yükleme bitti
        }

        // İsteğe bağlı: Birkaç saniye sonra mesajı ve progress'i temizle
        setTimeout(() => {
          setMessage("");
          setProgress(0);
        }, 7000);
      }
    );
  };

  return (
    <div
      style={{
        background: "#23272f",
        border: "none",
        boxShadow: "0 2px 8px #0006",
        padding: "28px 28px 20px 28px",
        marginBottom: "20px",
        borderRadius: "16px",
        maxWidth: 480,
        margin: "0 auto 20px auto",
      }}
    >
      <h3
        style={{
          color: "#fff",
          fontWeight: 600,
          fontSize: "1.3em",
          marginBottom: 12,
        }}
      >
        Yeni Dosya Yükle
      </h3>
      {error && (
        <p
          style={{
            color: "#ff5252",
            border: "1px solid #ff5252",
            background: "#2e1a1a",
            padding: "10px",
            margin: "10px 0",
            borderRadius: 6,
          }}
        >
          {error}
        </p>
      )}
      {message && (
        <p
          style={{
            color: "#28a745",
            border: "1px solid #28a745",
            background: "#1a2e1a",
            padding: "10px",
            margin: "10px 0",
            borderRadius: 6,
          }}
        >
          {message}
        </p>
      )}
      <div style={{ marginBottom: "10px" }}>
        <label
          htmlFor="file-upload"
          style={{
            display: "block",
            marginBottom: "5px",
            color: "#bbb",
            fontWeight: 500,
          }}
        >
          Dosya Seç:
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: "block", width: "100%" }}
        />
        {file && (
          <p style={{ fontSize: "0.95em", color: "#bbb", marginTop: "5px" }}>
            Seçilen dosya: <span style={{ color: "#fff" }}>{file.name}</span> (
            {file.size ? Math.round(file.size / 1024) : 0} KB)
          </p>
        )}
      </div>
      {progress > 0 && (
        <div
          style={{
            width: "100%",
            backgroundColor: "#18191a",
            borderRadius: "4px",
            margin: "10px 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "#1976d2",
              height: "24px",
              borderRadius: "4px",
              textAlign: "center",
              color: "white",
              lineHeight: "24px",
              transition: "width 0.3s ease-in-out",
            }}
          >
            {progress}%
          </div>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file || (progress > 0 && progress < 100)}
        style={{
          padding: "10px 15px",
          backgroundColor: progress > 0 && progress < 100 ? "#444" : "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor:
            !file || (progress > 0 && progress < 100)
              ? "not-allowed"
              : "pointer",
          fontWeight: 500,
          fontSize: "1em",
          marginTop: 8,
          width: "100%",
          boxShadow: "0 1px 4px #0002",
          transition: "background 0.2s",
        }}
      >
        {progress > 0 && progress < 100
          ? "Yükleniyor..."
          : "Seçili Dosyayı Yükle"}
      </button>
    </div>
  );
}

export default FileUpload;
