import React, { useEffect, useState } from 'react'
import AccessibilityWidget from '../components/AccessibilityWidget'
import { getCart, removeFromCart, updateQuantity, clearCart } from '../js/app'
import { Link } from 'react-router-dom'

export default function Carrito(){
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')

  useEffect(()=>{
    setCart(getCart())
  }, [])

  function handleRemove(i){
    const updated = removeFromCart(i)
    setCart(updated)
  }

  function handleQtyChange(i, value){
    const qty = Math.max(1, Number(value) || 1)
    const updated = updateQuantity(i, qty)
    setCart(updated)
  }

  function handleClear(){
    clearCart()
    setCart([])
    setMessage('Carrito vacío.')
  }

  function handleCheckout(){
    if(!cart.length){
      setMessage('No hay productos en el carrito.')
      return
    }
    // Simulación de checkout
    setMessage('Gracias por tu compra. (Simulación)')
    clearCart()
    setCart([])
  }

  const total = cart.reduce((sum, item)=> sum + (Number(item.precio || 0) * Number(item.cantidad || 1)), 0)

  return (
    <main className="container">
      {/* Accessibility panel integrated inside Pedidos/Carrito as a section */}
      <AccessibilityWidget />
      <h2>Tu Carrito</h2>
      {message && <p className="form-message">{message}</p>}
      {cart.length === 0 ? (
        <div>
          <p>No hay productos seleccionados.</p>
          <Link to="/productos">Ir a Productos</Link>
        </div>
      ) : (
        <div>
          <ul style={{listStyle:'none', padding:0}}>
            {cart.map((item, i) => (
              <li key={i} style={{display:'flex', gap:16, alignItems:'center', marginBottom:12, background:'#222', padding:12, borderRadius:8}}>
                <img src={item.imagen || '/Imagenes/Proteina.jpg'} alt={item.nombre} style={{width:100, height:80, objectFit:'cover', borderRadius:6}} />
                <div style={{flex:1}}>
                  <strong>{item.nombre}</strong>
                  <div>Precio: ${Number(item.precio).toLocaleString()}</div>
                  <div>
                    Cantidad: <input type="number" min="1" value={item.cantidad} onChange={(e)=>handleQtyChange(i, e.target.value)} style={{width:80}} />
                  </div>
                </div>
                <div>
                  <div>Subtotal:</div>
                  <div>${(Number(item.precio) * Number(item.cantidad)).toLocaleString()}</div>
                  <button onClick={()=>handleRemove(i)} style={{marginTop:8}}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{marginTop:16}}>
            <h3>Total: ${total.toLocaleString()}</h3>
            <button onClick={handleCheckout} style={{marginRight:8}}>Pagar</button>
            <button onClick={handleClear}>Vaciar</button>
          </div>
        </div>
      )}
    </main>
  )
}
