import React, { useEffect } from 'react'
import { initApp } from '../js/app'

export default function Registro(){
  useEffect(() => {
    initApp()
  }, [])

  return (
    <main>
      <div className="form-tabs" role="tablist" aria-label="Selector de formulario">
        <button type="button" id="tabRegistro" className="tab-button active" role="tab" aria-selected="true" aria-controls="registro-section">Registrarse</button>
        <button type="button" id="tabLogin" className="tab-button" role="tab" aria-selected="false" aria-controls="login-section">Iniciar sesión</button>
      </div>

      <section id="registro-section" role="tabpanel" aria-labelledby="registro-title" className="form-section active">
        <form id="registroForm" noValidate autoComplete="off">
          <h2 id="registro-title">Registro de Usuario</h2>
          <p className="intro">Completa tus datos para inscribirte de forma segura.</p>
          <fieldset>
            <legend>Información personal</legend>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input type="text" id="nombre" name="nombre" placeholder="Nombre Completo" required maxLength="50" pattern="[A-Za-zÀ-ÿ\s'-]+" autoComplete="name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" name="email" placeholder="Correo Electrónico" required maxLength="254" autoComplete="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" placeholder="Contraseña" required minLength="8" maxLength="128" autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmar contraseña" required minLength="8" maxLength="128" autoComplete="new-password" />
            </div>
          </fieldset>
          <button type="submit">Registrarse</button>
          <p id="mensaje" className="form-message" role="status" aria-live="polite"></p>
        </form>
      </section>

      <section id="login-section" role="tabpanel" aria-labelledby="login-title" className="form-section">
        <form id="loginForm" noValidate autoComplete="off">
          <h2 id="login-title">Iniciar sesión</h2>
          <p className="intro">Ingresa tus datos si ya tienes una cuenta registrada.</p>
          <div className="form-group">
            <label htmlFor="loginEmail">Correo electrónico</label>
            <input type="email" id="loginEmail" name="loginEmail" placeholder="usuario@ejemplo.com" required maxLength="254" autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Contraseña</label>
            <input type="password" id="loginPassword" name="loginPassword" placeholder="Contraseña" required minLength="8" maxLength="128" autoComplete="current-password" />
          </div>
          <button type="submit">Acceder</button>
          <p id="loginMessage" className="form-message" role="status" aria-live="polite"></p>
        </form>
      </section>
    </main>
  )
}
