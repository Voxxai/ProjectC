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
import Morgen from './pages/Morgen';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
          
        {/* Private Routes */}
        <Route element={<RequireAuth />} >
          <Route path="/" element={<Layout />}>
            <Route index element={<WeekOverzicht />} />
            <Route path='/evenementen' element={<Evenementen />} />
            <Route path='/nieuws' element={<Nieuws />} />
            <Route path='/morgen' element={<Morgen />} />

            <Route path='/instellingen' element={<Settings_Layout />}>
              <Route path='/instellingen/Profiel' element={<Profile />} />  
              <Route path='/instellingen/Security' element={<Security />} />  
              <Route path='/instellingen/Options' element={<Settings />} />  
            </Route>

          </Route> 
      </Route>
    </Routes>
  );
}

export default App;
