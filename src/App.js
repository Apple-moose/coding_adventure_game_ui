import React from "react";
import "./style/global.scss";
import { isMobile } from "react-device-detect";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GameStart from "./pages/GameStart";
import HomePageMobile from "./mobile/HomePageMobile";
import GameStartMobile from "./mobile/GameStartMobile";

export default function App() {
  return (
    <div>
      {isMobile ? (
        <Routes>
          <Route path="/" element={<HomePageMobile />} />
          <Route path="/mobile-start" element={<GameStartMobile />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/start" element={<GameStart />} />
        </Routes>
      )}
    </div>
  );
}
