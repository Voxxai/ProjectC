import React, { Profiler, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Layout from './layout/Layout';
import WeekOverzicht from "./pages/WeekOverzicht";
import RequireAuth from './components/RequireAuth';
import Nieuws from './pages/Nieuws';
import Settings_Layout from './layout/Settings_Layout';
import Profile from './pages/Profile';
import Security from './pages/Security';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        
          
        {/* Private Routes */}
        <Route element={<RequireAuth />} >
          <Route path="/" element={<Layout />}>
            <Route index element={<WeekOverzicht />} />
            <Route path='/evenementen' element={<WeekOverzicht />} />
            <Route path='/nieuws' element={<Nieuws />} />
            <Route path='/morgen' element={<WeekOverzicht />} />

            <Route path='/instellingen' element={<Settings_Layout />}>
              <Route path='/instellingen/profiel' element={<Profile />} />  
              <Route path='/instellingen/security' element={<Security />} />  
              <Route path='/instellingen/options' element={<Settings />} />  
            </Route>

          </Route> 
      </Route>
    </Routes>
  );
}

export default App;
