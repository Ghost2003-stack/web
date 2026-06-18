import React, { useState } from 'react'

export default function Contacto(){
  const [form, setForm] = useState({ nombre:'', email:'', mensaje:'' })
  const [status, setStatus] = useState('')

  function handleChange(e){
    setForm({...form, [e.target.name]: e.target.value})
  }

  function handleSubmit(e){
    e.preventDefault()
    const mensajes = JSON.parse(localStorage.getItem('gympro_messages') || '[]')
    mensajes.push(form)
    localStorage.setItem('gympro_messages', JSON.stringify(mensajes))
    setStatus('Mensaje enviado. Gracias!')
    setForm({ nombre:'', email:'', mensaje:'' })
  }

  return (
    <main className="container">
      <h2>Contáctanos</h2>
      {status && <p className="form-message">{status}</p>}
      <form onSubmit={handleSubmit} id="contactForm" noValidate>
        <div className="form-group">
          <label htmlFor="contactName">Nombre</label>
          <input id="contactName" name="nombre" value={form.nombre} onChange={handleChange} required minLength={2} maxLength={80} />
        </div>
        <div className="form-group">
          <label htmlFor="contactEmail">Correo electrónico</label>
          <input id="contactEmail" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="contactMessageInput">Mensaje</label>
          <textarea id="contactMessageInput" name="mensaje" rows={4} value={form.mensaje} onChange={handleChange} required minLength={10} maxLength={500} />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </main>
  )
}
