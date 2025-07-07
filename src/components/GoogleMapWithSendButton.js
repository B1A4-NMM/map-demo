import React, { useRef, useEffect, useState } from "react";

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const GoogleMapWithSendButton = () => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef(null);

  // 구글맵 스크립트 동적 로드
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 지도 생성 및 중심좌표 변경 이벤트 등록
  useEffect(() => {
    if (mapLoaded && window.google && mapRef.current) {
      const google = window.google;
      const map = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: 15,
        disableDefaultUI: true,
      });
      mapInstance.current = map;
      // 중심좌표 변경 이벤트
      map.addListener("center_changed", () => {
        const c = map.getCenter();
        setCenter({ lat: c.lat(), lng: c.lng() });
      });
    }
  }, [mapLoaded]);

  // 좌표 전송 함수
  const sendCoords = async () => {
    try {
      const response = await fetch("http://localhost:3000/coords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(center),
      });
      if (response.ok) {
        alert("좌표가 성공적으로 전송되었습니다!");
      } else {
        alert("전송 실패");
      }
    } catch (e) {
      alert("에러 발생: " + e.message);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "60vw",
          minHeight: 300,
          maxHeight: 500,
        }}
      >
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
        {/* 중앙 고정 마커 */}
        <img
          src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          alt="center marker"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 48,
            height: 48,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </div>
      <div style={{ margin: "16px 0", fontSize: 16, textAlign: "center" }}>
        <b>현재 중심 좌표</b>
        <br />
        위도 <span style={{ color: "#d32f2f" }}>{center.lat.toFixed(6)}</span>,
        경도 <span style={{ color: "#d32f2f" }}>{center.lng.toFixed(6)}</span>
      </div>
      <button
        onClick={sendCoords}
        style={{
          width: "100%",
          padding: "14px 0",
          fontSize: 18,
          background: "#d32f2f",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          cursor: "pointer",
        }}
      >
        좌표 전송
      </button>
    </div>
  );
};

export default GoogleMapWithSendButton;
