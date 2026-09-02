// src/components/FileList.js
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useDrag, useDrop } from "react-dnd";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useTheme } from "../contexts/ThemeContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import { v4 as uuidv4 } from 'uuid'; // Eğer uuid kullanacaksanız bu satırı aktif edin

const ItemTypes = {
  FILE: "file",
  FOLDER: "folder",
};

function FolderCard({
  folder,
  allFolders,
  setCurrentFolderId,
  menuOpenId,
  setMenuOpenId,
  setRenameModal,
  handleDeleteFolder,
  moveItemToFolder,
  theme,
}) {
  // Drop target klasör
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.FILE, ItemTypes.FOLDER],
    drop: (item) => moveItemToFolder(item, folder.id),
    canDrop: (item) => {
      if (item.type === "file") return item.folderId !== folder.id;
      // Klasörün kendi altına veya kendisine taşınmasını engelle
      let parent = folder;
      while (parent) {
        if (parent.id === item.id) return false;
        parent = allFolders.find((f) => f.id === parent.parentId);
      }
      return item.parentId !== folder.id;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  // Drag source klasör
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FOLDER,
    item: { type: "folder", id: folder.id, parentId: folder.parentId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        background:
          isOver && canDrop
            ? theme.primary
            : isDragging
            ? theme.surface
            : theme.surface,
        borderRadius: 20,
        boxShadow:
          isOver && canDrop ? `0 4px 16px ${theme.primary}aa` : theme.shadow,
        padding: 28,
        position: "relative",
        height: 210,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        border: `2px solid ${theme.cardBorder}`,
        transition: "all 0.3s ease",
        opacity: isDragging ? 0.5 : 1,
        marginBottom: 0,
      }}
      onClick={() => setCurrentFolderId(folder.id)}
      title={folder.name}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = `0 4px 16px ${theme.primary}aa`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          isOver && canDrop ? `0 4px 16px ${theme.primary}aa` : theme.shadow)
      }
    >
      <button
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          color: theme.textSecondary,
          fontSize: 26,
          cursor: "pointer",
          zIndex: 2,
          transition: "all 0.3s ease",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpenId(menuOpenId === folder.id ? null : folder.id);
        }}
      >
        &#8942;
      </button>
      {menuOpenId === folder.id && (
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 16,
            background: theme.surface,
            borderRadius: 10,
            boxShadow: theme.shadow,
            zIndex: 10,
            minWidth: 130,
            border: `1px solid ${theme.cardBorder}`,
            transition: "all 0.3s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setMenuOpenId(null);
              setRenameModal({
                open: true,
                type: "folder",
                id: folder.id,
                name: folder.name,
              });
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              background: "none",
              border: "none",
              color: theme.text,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Yeniden Adlandır
          </button>
          <button
            onClick={() => {
              setMenuOpenId(null);
              handleDeleteFolder(folder.id);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              background: "none",
              border: "none",
              color: theme.text,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Sil
          </button>
        </div>
      )}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 60,
            marginBottom: 18,
            color: theme.textSecondary,
            transition: "all 0.3s ease",
          }}
        >
          📁
        </div>
        <div
          style={{
            color: theme.text,
            fontWeight: 600,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            fontSize: "1.15em",
            letterSpacing: 0.2,
            transition: "all 0.3s ease",
          }}
        >
          {folder.name}
        </div>
      </div>
    </div>
  );
}

function FileCard({
  item,
  menuOpenId,
  setMenuOpenId,
  setRenameModal,
  handleDeleteFile,
  handleShareAndDownload,
  handleShareAndCopy,
  sharingStates,
  theme,
}) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FILE,
    item: { type: "file", id: item.id, folderId: item.folderId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const currentFileSharingState = sharingStates[item.id] || {
    loading: false,
    link: null,
    error: null,
  };
  return (
    <div
      ref={drag}
      style={{
        background: isDragging ? theme.surface : theme.surface,
        borderRadius: 20,
        boxShadow: isDragging ? `0 4px 16px ${theme.primary}aa` : theme.shadow,
        padding: 28,
        position: "relative",
        height: 210,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: `2px solid ${theme.cardBorder}`,
        transition: "all 0.3s ease",
        opacity: isDragging ? 0.5 : 1,
        marginBottom: 0,
      }}
      title={item.name}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = `0 4px 16px ${theme.primary}aa`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = isDragging
          ? `0 4px 16px ${theme.primary}aa`
          : theme.shadow)
      }
    >
      <button
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          color: theme.textSecondary,
          fontSize: 26,
          cursor: "pointer",
          zIndex: 2,
          transition: "all 0.3s ease",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpenId(menuOpenId === item.id ? null : item.id);
        }}
      >
        &#8942;
      </button>
      {menuOpenId === item.id && (
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 16,
            background: theme.surface,
            borderRadius: 10,
            boxShadow: theme.shadow,
            zIndex: 10,
            minWidth: 130,
            border: `1px solid ${theme.cardBorder}`,
            transition: "all 0.3s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setMenuOpenId(null);
              handleShareAndDownload(item);
            }}
            disabled={currentFileSharingState.loading}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              background: "none",
              border: "none",
              color: theme.text,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {currentFileSharingState.loading ? "Oluşturuluyor..." : "İndir"}
          </button>
          <button
            onClick={() => {
              setMenuOpenId(null);
              handleShareAndCopy(item);
            }}
            disabled={currentFileSharingState.loading}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              background: "none",
              border: "none",
              color: theme.text,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {currentFileSharingState.loading ? "Oluşturuluyor..." : "Paylaş"}
          </button>
          <button
            onClick={() => {
              setMenuOpenId(null);
              setRenameModal({
                open: true,
                type: "file",
                id: item.id,
                name: item.name,
              });
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              background: "none",
              border: "none",
              color: theme.text,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Yeniden Adlandır
          </button>
          <button
            onClick={() => {
              setMenuOpenId(null);
              handleDeleteFile(item.id);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              background: "none",
              border: "none",
              color: theme.text,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Sil
          </button>
        </div>
      )}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 54,
            marginBottom: 18,
            color: theme.textSecondary,
            transition: "all 0.3s ease",
          }}
        >
          📄
        </div>
        <div
          style={{
            color: theme.text,
            fontWeight: 400,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            fontSize: "1.08em",
            letterSpacing: 0.1,
            transition: "all 0.3s ease",
          }}
        >
          {item.name}
        </div>
        <small
          style={{
            display: "block",
            color: theme.textSecondary,
            marginTop: 10,
            fontSize: "0.98em",
            fontWeight: 400,
            transition: "all 0.3s ease",
          }}
        >
          Boyut: {item.size ? Math.round(item.size / 1024) : 0} KB
          {item.createdAt &&
            item.createdAt.toDate &&
            ` - Tarih: ${item.createdAt.toDate().toLocaleDateString("tr-TR")}`}
        </small>
      </div>
    </div>
  );
}

function FileList() {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [sharingStates, setSharingStates] = useState({});
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameModal, setRenameModal] = useState({
    open: false,
    type: null,
    id: null,
    name: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const { theme } = useTheme();

  // Klasörleri çek
  useEffect(() => {
    if (!currentUser) {
      setAllFolders([]);
      return;
    }
    const q = query(
      collection(db, "folders"),
      where("ownerId", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const folders = [];
      querySnapshot.forEach((doc) => {
        folders.push({ id: doc.id, ...doc.data() });
      });
      setAllFolders(folders);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Dosyaları çek
  useEffect(() => {
    if (!currentUser) {
      setAllFiles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const q = query(
      collection(db, "files"),
      where("ownerId", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const userFiles = [];
        querySnapshot.forEach((doc) => {
          userFiles.push({ id: doc.id, ...doc.data() });
        });
        setAllFiles(userFiles);
        setLoading(false);
      },
      (err) => {
        setError("Dosyalarınızı yüklerken bir sorun oluştu.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [currentUser]);

  // Seçili klasörün alt klasörleri ve dosyaları
  const displayedFolders = useMemo(
    () =>
      allFolders.filter(
        (f) => (f.parentId || null) === (currentFolderId || null)
      ),
    [allFolders, currentFolderId]
  );
  const displayedFiles = useMemo(
    () =>
      allFiles.filter(
        (f) => (f.folderId || null) === (currentFolderId || null)
      ),
    [allFiles, currentFolderId]
  );

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!currentFolderId) return [{ name: "Ana Dizin", id: null }];
    const crumbs = [];
    let folder = allFolders.find((f) => f.id === currentFolderId);
    while (folder) {
      crumbs.unshift({ name: folder.name, id: folder.id });
      folder = allFolders.find((f) => f.id === folder.parentId);
    }
    crumbs.unshift({ name: "Ana Dizin", id: null });
    return crumbs;
  }, [currentFolderId, allFolders]);

  // Klasör oluşturma
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !currentUser) return;
    await addDoc(collection(db, "folders"), {
      name: newFolderName.trim(),
      parentId: currentFolderId || null,
      ownerId: currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setShowCreateFolder(false);
    setNewFolderName("");
  };

  const handleShareAndCopy = async (fileToShare) => {
    if (!currentUser) {
      alert("Paylaşım linki oluşturmak için lütfen giriş yapın.");
      return;
    }
    setSharingStates((prevStates) => ({
      ...prevStates,
      [fileToShare.id]: { loading: true, link: null, error: null },
    }));
    try {
      const sharedLinkDocRef = await addDoc(collection(db, "sharedLinks"), {
        fileId: fileToShare.id,
        fileName: fileToShare.name,
        originalFileUrl: fileToShare.url,
        ownerId: currentUser.uid,
        createdAt: serverTimestamp(),
        downloadCount: 0,
      });
      const generatedLink = `${window.location.origin}/share/${sharedLinkDocRef.id}`;
      setSharingStates((prevStates) => ({
        ...prevStates,
        [fileToShare.id]: { loading: false, link: generatedLink, error: null },
      }));
      // Panoya kopyala
      await navigator.clipboard.writeText(generatedLink);
      alert("Paylaşım linki panoya kopyalandı!");
    } catch (error) {
      console.error("Paylaşım linki oluşturma hatası:", error);
      setSharingStates((prevStates) => ({
        ...prevStates,
        [fileToShare.id]: {
          loading: false,
          link: null,
          error: "Link oluşturulamadı.",
        },
      }));
      alert(
        "Paylaşım linki oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleShareAndDownload = async (fileToShare) => {
    if (!currentUser) {
      alert("İndirme linki oluşturmak için lütfen giriş yapın.");
      return;
    }
    setSharingStates((prevStates) => ({
      ...prevStates,
      [fileToShare.id]: { loading: true, link: null, error: null },
    }));
    try {
      const sharedLinkDocRef = await addDoc(collection(db, "sharedLinks"), {
        fileId: fileToShare.id,
        fileName: fileToShare.name,
        originalFileUrl: fileToShare.url,
        ownerId: currentUser.uid,
        createdAt: serverTimestamp(),
        downloadCount: 0,
      });
      const generatedLink = `${window.location.origin}/share/${sharedLinkDocRef.id}`;
      setSharingStates((prevStates) => ({
        ...prevStates,
        [fileToShare.id]: { loading: false, link: generatedLink, error: null },
      }));
      // Yeni sekmede aç (otomatik indirme için)
      window.open(generatedLink, "_blank");
    } catch (error) {
      console.error("İndirme linki oluşturma hatası:", error);
      setSharingStates((prevStates) => ({
        ...prevStates,
        [fileToShare.id]: {
          loading: false,
          link: null,
          error: "Link oluşturulamadı.",
        },
      }));
      alert(
        "İndirme linki oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  // Silme fonksiyonları
  const handleDeleteFolder = async (folderId) => {
    if (
      !window.confirm(
        "Bu klasörü ve altındaki tüm klasör/dosyaları silmek istediğinize emin misiniz?"
      )
    )
      return;
    // Alt klasör ve dosyaları da silmek için recursive silme yapılabilir (şimdilik sadece klasörü siliyoruz)
    await deleteDoc(doc(db, "folders", folderId));
  };
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, "files", fileId));
  };

  // Yeniden adlandırma fonksiyonu
  const handleRename = async () => {
    if (!renameModal.name.trim()) return;
    if (renameModal.type === "folder") {
      await updateDoc(doc(db, "folders", renameModal.id), {
        name: renameModal.name.trim(),
      });
    } else if (renameModal.type === "file") {
      await updateDoc(doc(db, "files", renameModal.id), {
        name: renameModal.name.trim(),
      });
    }
    setRenameModal({ open: false, type: null, id: null, name: "" });
  };

  // Sürükle-bırak: dosya veya klasörü başka klasöre taşı
  const moveItemToFolder = async (item, targetFolderId) => {
    if (item.type === "file") {
      await updateDoc(doc(db, "files", item.id), { folderId: targetFolderId });
    } else if (item.type === "folder") {
      // Kendi içine veya altına taşımayı engelle
      if (item.id === targetFolderId) return;
      await updateDoc(doc(db, "folders", item.id), {
        parentId: targetFolderId,
      });
    }
  };

  // Drag-and-drop upload handler
  const handleDrop = async (e) => {
    if (
      !e.dataTransfer ||
      !e.dataTransfer.files ||
      e.dataTransfer.files.length === 0
    ) {
      // Let React DnD handle site-internal drag and drop
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setUploadError("");
    setUploadMessage("");
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    if (!currentUser) {
      setUploadError("Dosya yüklemek için giriş yapmalısınız.");
      return;
    }
    for (const file of files) {
      setUploadProgress(0);
      setUploadMessage("");
      setUploadError("");
      const storagePath = `files/${currentUser.uid}/${file.name}`;
      const storageRef = ref(storage, storagePath);
      const metadata = {
        contentType: file.type,
        contentDisposition: `attachment; filename=\"${file.name}\"`,
      };
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      await new Promise((resolve) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progressPercent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progressPercent);
          },
          (uploadError) => {
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
            setUploadError(userFriendlyError);
            setUploadProgress(0);
            setUploadMessage("");
            resolve();
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await addDoc(collection(db, "files"), {
                name: file.name,
                url: downloadURL,
                path: storagePath,
                size: file.size,
                type: file.type,
                ownerId: currentUser.uid,
                folderId: currentFolderId || null,
                createdAt: serverTimestamp(),
              });
              setUploadMessage(`'${file.name}' başarıyla yüklendi.`);
              setUploadProgress(100);
            } catch (dbError) {
              setUploadError(
                "Dosya yüklendi ancak veritabanına kaydedilirken bir sorun oluştu."
              );
              setUploadProgress(100);
            }
            setTimeout(() => {
              setUploadMessage("");
              setUploadProgress(0);
            }, 5000);
            resolve();
          }
        );
      });
    }
  };

  const handleDragOver = (e) => {
    if (
      e.dataTransfer &&
      e.dataTransfer.types &&
      Array.from(e.dataTransfer.types).includes("Files")
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Otherwise, let React DnD handle
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: 20 }}>
        Dosyalar yükleniyor...
      </p>
    );
  }
  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: 20 }}>
        {error}
      </p>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          minHeight: "100vh",
          background: theme.background,
          color: theme.text,
          width: "100%",
          padding: "32px",
          transition: "all 0.3s ease",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Progress/Error/Success bar */}
        {uploadProgress > 0 && (
          <div
            style={{
              width: "100%",
              backgroundColor: theme.surface,
              borderRadius: "6px",
              marginBottom: 18,
              overflow: "hidden",
              boxShadow: theme.shadow,
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: theme.primary,
                height: "18px",
                borderRadius: "6px",
                textAlign: "center",
                color: theme.text,
                lineHeight: "18px",
                transition: "width 0.3s ease-in-out, background 0.3s",
                fontSize: "0.95em",
              }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}
        {uploadError && (
          <div
            style={{
              color: theme.error,
              background: theme.background,
              border: `1px solid ${theme.error}`,
              borderRadius: 6,
              padding: "10px 18px",
              marginBottom: 12,
              fontWeight: 500,
              maxWidth: 480,
              transition: "all 0.3s ease",
            }}
          >
            {uploadError}
          </div>
        )}
        {uploadMessage && (
          <div
            style={{
              color: theme.primary,
              background: theme.background,
              border: `1px solid ${theme.primary}`,
              borderRadius: 6,
              padding: "10px 18px",
              marginBottom: 12,
              fontWeight: 500,
              maxWidth: 480,
              transition: "all 0.3s ease",
            }}
          >
            {uploadMessage}
          </div>
        )}
        <div
          style={{
            marginTop: 2,
            marginBottom: 18,
            background: theme.surface,
            borderRadius: 14,
            color: theme.text,
            display: "flex",
            alignItems: "center",
            fontSize: "1.25em",
            fontWeight: 500,
            padding: "12px 24px",
            gap: 18,
            boxShadow: theme.shadow,
            width: "80vw",
            maxWidth: 900,
            minWidth: 400,
            marginLeft: "auto",
            marginRight: "auto",
            overflowX: "auto",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flex: 1,
              overflowX: "auto",
            }}
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <button
                  key={crumb.id || "root"}
                  onClick={() => setCurrentFolderId(crumb.id)}
                  disabled={isLast}
                  style={{
                    background: isLast ? theme.primary : theme.surface,
                    color: isLast ? theme.text : theme.textSecondary,
                    border: isLast ? "none" : `1.5px solid ${theme.primary}`,
                    borderRadius: 8,
                    padding: "6px 18px",
                    fontWeight: isLast ? 700 : 500,
                    fontSize: "1.08em",
                    cursor: isLast ? "default" : "pointer",
                    marginRight: idx !== breadcrumbs.length - 1 ? 0 : 0,
                    boxShadow: isLast ? `0 1px 4px ${theme.primary}aa` : "none",
                    transition: "all 0.2s ease",
                    outline: "none",
                    minWidth: 80,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    maxWidth: 180,
                  }}
                  title={crumb.name}
                >
                  {crumb.name === "Ana Dizin" || crumb.name === "Ana Sayfa"
                    ? "Ana Sayfa"
                    : crumb.name}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowCreateFolder(true)}
            style={{
              marginLeft: 18,
              background: theme.primary,
              color: theme.text,
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1.08em",
              boxShadow: theme.shadow,
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            + Yeni Klasör
          </button>
        </div>
        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 36,
            marginTop: 36,
            padding: "0 12px",
            transition: "all 0.3s ease",
          }}
        >
          {displayedFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              allFolders={allFolders}
              setCurrentFolderId={setCurrentFolderId}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              setRenameModal={setRenameModal}
              handleDeleteFolder={handleDeleteFolder}
              moveItemToFolder={moveItemToFolder}
              theme={theme}
            />
          ))}
          {displayedFiles.map((item) => (
            <FileCard
              key={item.id}
              item={item}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              setRenameModal={setRenameModal}
              handleDeleteFile={handleDeleteFile}
              handleShareAndDownload={handleShareAndDownload}
              handleShareAndCopy={handleShareAndCopy}
              sharingStates={sharingStates}
              theme={theme}
            />
          ))}
        </div>
        {/* Modal */}
        {showCreateFolder && (
          <div
            style={{
              background: theme.surface,
              padding: 20,
              borderRadius: 8,
              margin: "20px auto",
              maxWidth: 400,
              color: theme.text,
              boxShadow: theme.shadow,
              transition: "all 0.3s ease",
            }}
          >
            <h4 style={{ color: theme.text }}>Klasör Oluştur</h4>
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Klasör adı"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: `1px solid ${theme.border}`,
                marginBottom: 12,
                background: theme.background,
                color: theme.text,
                transition: "all 0.3s ease",
              }}
            />
            <div>
              <button
                onClick={handleCreateFolder}
                style={{
                  background: theme.primary,
                  color: theme.text,
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 16px",
                  marginRight: 10,
                  transition: "all 0.3s ease",
                }}
              >
                Oluştur
              </button>
              <button
                onClick={() => setShowCreateFolder(false)}
                style={{
                  background: theme.border,
                  color: theme.text,
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 16px",
                  transition: "all 0.3s ease",
                }}
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default FileList;
