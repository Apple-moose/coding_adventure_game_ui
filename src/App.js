import React from "react";
import "./style/global.scss";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GameStart from "./pages/GameStart";

export default function App() {
return (

<div className="GameBasic">
<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/start" element={<GameStart />} />
</Routes>
</div>
);
}
