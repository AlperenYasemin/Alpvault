import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
const PEXELS_API_URL =
  "https://api.pexels.com/v1/search?query=nature&per_page=30";

const COLUMN_COUNT = 6;
const SCROLL_SPEED = 0.7; // px/frame
const IMAGE_BOX_WIDTH = 220;
const GAP = 12;

export default function PhotoWall({ apiKey = PEXELS_API_KEY }) {
  const { theme } = useTheme();
  const [photos, setPhotos] = useState([]);
  const [offsets, setOffsets] = useState(Array(COLUMN_COUNT).fill(0));
  const wallRef = useRef(null);
  const animFrame = useRef();

  // Fotoğrafları çek
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch(PEXELS_API_URL, {
          headers: { Authorization: apiKey },
        });
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch (e) {
        setPhotos([]);
      }
    }
    fetchPhotos();
  }, [apiKey]);

  // Fotoğrafları sütunlara böl
  const columns = Array.from({ length: COLUMN_COUNT }, (_, colIdx) =>
    photos.filter((_, i) => i % COLUMN_COUNT === colIdx)
  );

  // Her sütunu ekran yüksekliğini dolduracak kadar döngüyle çoğalt
  function fillColumnToScreen(col, minHeight) {
    if (col.length === 0) return [];
    const result = [];
    let h = 0;
    let idx = 0;
    while (h < window.innerHeight) {
      // img oranı bilinmediği için ortalama bir yükseklik tahminiyle ilerle
      // ama asıl amaç: en az bir ekran yüksekliği kadar kutu eklemek
      result.push(col[idx % col.length]);
      h += 150; // ortalama yükseklik, daha iyi bir tahmin için kutu yükseklikleri ölçülebilir
      idx++;
    }
    return result;
  }
  const filledColumns = columns.map((col) =>
    fillColumnToScreen(col, window.innerHeight)
  );
  // Sonsuz loop için her sütunu iki kez render et
  const doubledColumns = filledColumns.map((col) => [...col, ...col]);

  // Her sütunun yüksekliğini ölçmek için refs
  const colRefs = useRef(Array(COLUMN_COUNT).fill(null));
  const [colHeights, setColHeights] = useState(Array(COLUMN_COUNT).fill(0));
  useEffect(() => {
    setColHeights(
      colRefs.current.map((ref) => (ref ? ref.scrollHeight / 2 : 0))
    );
  }, [photos]);

  // Animasyon: Sütunlar yukarı/aşağı hareket eder
  useEffect(() => {
    let running = true;
    function animate() {
      setOffsets((prev) =>
        prev.map((val, idx) => {
          const dir = idx % 2 === 0 ? 1 : -1;
          const h = colHeights[idx];
          let next = val + dir * SCROLL_SPEED;
          if (h > 0) {
            if (dir === 1 && next > h) next = 0; // yukarı hareket edenler
            if (dir === -1 && next < -h) next = 0; // aşağı hareket edenler
          }
          return next;
        })
      );
      if (running) animFrame.current = requestAnimationFrame(animate);
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(animFrame.current);
    };
  }, [colHeights]);

  // Opaklık fonksiyonu: kutunun üstü ekrana ne kadar yakınsa o kadar şeffaf
  function getOpacity(boxTop, boxHeight, wallHeight) {
    const centerY = boxTop + boxHeight / 2;
    const ratio = 1 - Math.max(0, Math.min(centerY / wallHeight, 1));
    return ratio;
  }

  // Sütun genişliği ve konumları
  const wallWidth = COLUMN_COUNT * IMAGE_BOX_WIDTH + (COLUMN_COUNT - 1) * GAP;

  return (
    <div
      ref={wallRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        background: "#222",
        overflow: "hidden",
        display: "block",
      }}
    >
      <div
        style={{
          position: "relative",
          width: wallWidth,
          height: "100vh",
          margin: "0 auto",
        }}
      >
        {doubledColumns.map((col, colIdx) => {
          const dir = colIdx % 2 === 0 ? 1 : -1;
          const offset = offsets[colIdx];
          return (
            <div
              key={colIdx}
              ref={(el) => (colRefs.current[colIdx] = el)}
              style={{
                position: "absolute",
                left: colIdx * (IMAGE_BOX_WIDTH + GAP),
                top: 0,
                width: IMAGE_BOX_WIDTH,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform:
                  dir === 1
                    ? `translateY(${-offset}px)`
                    : `translateY(${offset}px)`,
                willChange: "transform",
              }}
            >
              {col.map((photo, idx) => (
                <PhotoBox
                  key={photo.id + "-" + idx}
                  photo={photo}
                  wallRef={wallRef}
                  getOpacity={getOpacity}
                  gap={GAP}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhotoBox({ photo, wallRef, getOpacity, gap }) {
  const boxRef = useRef();
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    function updateOpacity() {
      if (!boxRef.current || !wallRef.current) return;
      const boxRect = boxRef.current.getBoundingClientRect();
      const wallRect = wallRef.current.getBoundingClientRect();
      setOpacity(
        getOpacity(boxRect.top - wallRect.top, boxRect.height, wallRect.height)
      );
    }
    updateOpacity();
    window.addEventListener("scroll", updateOpacity);
    window.addEventListener("resize", updateOpacity);
    return () => {
      window.removeEventListener("scroll", updateOpacity);
      window.removeEventListener("resize", updateOpacity);
    };
  }, [getOpacity, wallRef]);
  return (
    <div
      ref={boxRef}
      style={{
        width: "100%",
        marginBottom: gap,
        borderRadius: 18,
        boxShadow: "0 2px 12px #0002",
        overflow: "hidden",
        background: "#222",
        opacity,
        transition: "opacity 0.2s linear",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={photo.src.large}
        alt={photo.photographer}
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}
