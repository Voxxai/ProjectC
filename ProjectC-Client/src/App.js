import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Topbar from "./layout/Topbar";
import Navbar from "./layout/Navbar";
import WeekOverzicht from "./pages/WeekOverzicht";
import Nieuws from './pages/Nieuws';


function App() {
  return (
    <div>
      
        <main className='flex flex-row'>
          <Navbar />
          <div className='main-container'>
            {/* <Login /> */}
            <Nieuws />
          </div>
        </main>
        </div>
  );
}

export default App;
