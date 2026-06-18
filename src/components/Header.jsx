import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header>
      <div className="header-inner">
        <h1>💪 SUPLEMENTOS GYM PRO</h1>
        <nav aria-label="Navegación principal">
          <ul className="main-nav">
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/registro">Registro</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/carrito">Carrito</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
