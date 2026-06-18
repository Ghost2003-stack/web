import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Suplementos from './pages/SuplementosGymPro'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import Contacto from './pages/Contacto'
import Header from './components/Header'

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Suplementos />} />
        <Route path="/productos" element={<Suplementos />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </div>
  )
}
