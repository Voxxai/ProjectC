import React, { Profiler, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Layout from './layout/Layout';
import WeekOverzicht from "./pages/WeekOverzicht";
import RequireAuth from './components/RequireAuth';
import Evenementen from './pages/Evenementen';
import Nieuws from './pages/Nieuws';
import Settings_Layout from './layout/Settings_Layout';
import Profile from './pages/Profile';
import Security from './pages/Security';
import Settings from './pages/Settings';
import EventSelector from './pages/EventSelector';
import Morgen from './pages/Morgen';

function App() {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
          
        {/* Private Routes */}
        <Route element={<RequireAuth />} >
          <Route path="/" element={<Layout />}>
            <Route index element={<WeekOverzicht />} />
            <Route path='/evenementen' element={<Evenementen />} />
            <Route path='/nieuws' element={<Nieuws />} />
            <Route path='/morgen' element={<Morgen />} />

            <Route path='/instellingen' element={<Settings_Layout />}>
              <Route path='/instellingen/profiel' element={<Profile />} />  
              <Route path='/instellingen/security' element={<Security />} />  
              <Route path='/instellingen/options' element={<Settings />} />  
              {/* <Route path='/instellingen/evenementen' element={<EventSelector />} />   */}
            </Route>

          </Route> 
      </Route>
    </Routes>
  );
}

export default App;
