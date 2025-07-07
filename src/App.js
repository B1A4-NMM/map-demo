import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import MapWithSendButton from "./components/MapWithSendButton";
import GoogleMapWithSendButton from "./components/GoogleMapWithSendButton";

const KakaoPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>카카오맵 좌표 전송 데모</h1>
      <MapWithSendButton />
      <button
        style={{ width: "100%", marginTop: 16, padding: 12, fontSize: 16 }}
        onClick={() => navigate("/google")}
      >
        구글맵으로 이동
      </button>
    </div>
  );
};

const GooglePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>구글맵 좌표 전송 데모</h1>
      <GoogleMapWithSendButton />
      <button
        style={{ width: "100%", marginTop: 16, padding: 12, fontSize: 16 }}
        onClick={() => navigate("/")}
      >
        카카오맵으로 이동
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KakaoPage />} />
        <Route path="/google" element={<GooglePage />} />
      </Routes>
    </Router>
  );
}

export default App;
