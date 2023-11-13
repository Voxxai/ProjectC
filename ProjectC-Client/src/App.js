import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Layout from './layout/Layout';
import WeekOverzicht from "./pages/WeekOverzicht";
import RequireAuth from './components/RequireAuth';
import Nieuws from './pages/Nieuws';

function App() {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path='/Login' element={<Login />} />        
          
        {/* Private Routes */}
        <Route element={<RequireAuth />} >
          <Route path="/" element={<Layout />}>
          <Route index element={<WeekOverzicht />} />
          <Route path='/Evenementen' element={<WeekOverzicht />} />
          <Route path='/Nieuws' element={<Nieuws />} />
          <Route path='/Morgen' element={<WeekOverzicht />} />
         </Route> 
      </Route>
    </Routes>
  );
}

export default App;
