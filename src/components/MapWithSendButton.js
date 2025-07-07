import React, { useEffect, useRef, useState } from "react";

const KAKAO_MAP_API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;

const MapWithSendButton = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 서울 기본값
  const [mapLoaded, setMapLoaded] = useState(false);

  // 카카오맵 스크립트 동적 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
      });
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 지도 생성 및 중심좌표 변경 이벤트 등록
  useEffect(() => {
    if (mapLoaded && window.kakao && mapRef.current) {
      const kakao = window.kakao;
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 3,
      });

      // 지도 중심에 마커 고정 (빨간색, 큰 크기)
      const markerImage = new kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
        new kakao.maps.Size(48, 48), // 마커 크기
        { offset: new kakao.maps.Point(24, 48) } // 마커의 좌표와 이미지의 위치를 맞춤
      );
      const marker = new kakao.maps.Marker({
        position: map.getCenter(),
        map: map,
        image: markerImage,
      });
      markerRef.current = marker;

      // 중심좌표 변경 이벤트
      kakao.maps.event.addListener(map, "center_changed", function () {
        const latlng = map.getCenter();
        setCenter({ lat: latlng.getLat(), lng: latlng.getLng() });
        marker.setPosition(latlng);
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
        ref={mapRef}
        style={{
          width: "100%",
          height: "60vw",
          minHeight: 300,
          maxHeight: 500,
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />
      <div style={{ margin: "16px 0", fontSize: 16, textAlign: "center" }}>
        <b>현재 중심 좌표</b>
        <br />
        위도 <span style={{ color: "#0077ff" }}>{center.lat.toFixed(6)}</span>,
        경도 <span style={{ color: "#0077ff" }}>{center.lng.toFixed(6)}</span>
      </div>
      <button
        onClick={sendCoords}
        style={{
          width: "100%",
          padding: "14px 0",
          fontSize: 18,
          background: "#0077ff",
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

export default MapWithSendButton;
