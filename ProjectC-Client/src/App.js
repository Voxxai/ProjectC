import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Layout from './layout/Layout';
import WeekOverzicht from "./pages/WeekOverzicht";
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
        
          
        {/* Private Routes */}
        <Route element={<RequireAuth />} >
          <Route path='/Login' element={<Login />} />
          <Route index element={<WeekOverzicht />} />
          <Route path='/Evenementen' element={<WeekOverzicht />} />
          <Route path='/Nieuws' element={<WeekOverzicht />} />
          <Route path='/Morgen' element={<WeekOverzicht />} />
         </Route> 
      </Route>
    </Routes>
  );
}

export default App;
