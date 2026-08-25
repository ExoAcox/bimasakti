import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css'
import "./i18n";

import Cube from './pages/cube'
import SolarSystem from './pages/solar-system';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<SolarSystem />} />
        <Route path="/cube" element={<Cube />} />
        <Route path="/solar-system" element={<SolarSystem />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
