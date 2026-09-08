import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Analytics } from "@vercel/analytics/react";
import './index.css'
import "./i18n";

import Home from './index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/milky_way" replace={true} />} />
        <Route path="/:universe" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
