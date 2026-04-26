import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        <Navbar />
        <main style={{flex:1}}>
          <Routes>
            <Route path="/" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
