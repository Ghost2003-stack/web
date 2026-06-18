import React, { useEffect, useRef, useState } from 'react'
import '../styles/accessibilityWidget.css'

// AccessibilityWidget
// React component implementing an accessibility panel and floating button
// WCAG AAA: includes keyboard operability, aria-live announcements,
// focus management, contrast modes, font sizing, line-height, paragraph spacing,
// OpenDyslexic loading, and persistence via localStorage.

const STORAGE_KEY = 'accessibility_prefs'

const defaultPrefs = {
  fontSize: 100, // percent
  lineHeight: 1.5,
  paraSpacing: 1,
  contrast: 'normal', // normal | high | inverted | grayscale | low-brightness
  dyslexic: false,
  letterSpacing: 'normal', // normal | wide | wider
  textAlign: 'left'
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState(defaultPrefs)
  const [announce, setAnnounce] = useState('')
  const firstControlRef = useRef(null)

  useEffect(()=>{
    // Load saved preferences
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      if(raw){
        setPrefs(JSON.parse(raw))
      }
    }catch(e){/* ignore */}
  },[])

  useEffect(()=>{
    // Apply preferences to document (robust, affects whole page)
    applyPrefs(prefs)
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)) }catch(e){}
  },[prefs])

  useEffect(()=>{
    // when opening, move focus to first control
    if(open && firstControlRef.current){
      firstControlRef.current.focus()
    }
  },[open])

  function announceChange(text){
    setAnnounce(text)
    // clear after short time (but not timed-critical)
    setTimeout(()=>setAnnounce(''),1200)
  }

  function applyPrefs(p){
    const root = document.documentElement
    // font size
    root.style.fontSize = `${p.fontSize}%`
    // line height and paragraph spacing applied via CSS vars
    root.style.setProperty('--aw-line-height', String(p.lineHeight))
    root.style.setProperty('--aw-para-spacing', `${p.paraSpacing}em`)
    // letter spacing
    const letterMap = { normal: '0', wide: '0.05em', wider: '0.12em' }
    root.style.setProperty('--aw-letter-spacing', letterMap[p.letterSpacing]||'0')
    // text align
    root.style.setProperty('--aw-text-align', p.textAlign)
    // dyslexic font
    if(p.dyslexic){
      // dynamically load OpenDyslexic if not present
      if(!document.getElementById('aw-open-dyslexic')){
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@master/OpenDyslexic.css'
        link.id = 'aw-open-dyslexic'
        link.onload = ()=>{ document.documentElement.classList.add('aw-dyslexic') }
        link.onerror = ()=>{ /* fail silently */ }
        document.head.appendChild(link)
      }else{
        document.documentElement.classList.add('aw-dyslexic')
      }
    }else{
      document.documentElement.classList.remove('aw-dyslexic')
    }
    // contrast modes: set data attribute for CSS
    document.documentElement.setAttribute('data-aw-contrast', p.contrast)
    announceChange('Preferencia de accesibilidad aplicada')
  }

  // Controls handlers
  function changeFontSize(delta){
    setPrefs(prev=>{
      const next = Math.min(150, Math.max(80, prev.fontSize + delta))
      const res = {...prev, fontSize: next}
      announceChange(`Tamaño de texto: ${res.fontSize}%`)
      return res
    })
  }

  function setLineHeight(value){ setPrefs(p=>({...p, lineHeight: value})); announceChange(`Interlineado: ${value}`) }
  function setParaSpacing(value){ setPrefs(p=>({...p, paraSpacing: value})); announceChange(`Espaciado entre párrafos: ${value}em`) }
  function setContrast(mode){ setPrefs(p=>({...p, contrast: mode})); announceChange(`Contraste: ${mode}`) }
  function toggleDyslexic(){ setPrefs(p=>({...p, dyslexic: !p.dyslexic})); announceChange('Tipografía OpenDyslexic '+(!prefs.dyslexic? 'activada':'desactivada')) }
  function setLetterSpacing(v){ setPrefs(p=>({...p, letterSpacing: v})); announceChange('Espaciado de letras: '+v) }
  function setTextAlign(v){ setPrefs(p=>({...p, textAlign: v})); announceChange('Alineación: '+v) }

  function resetAll(){
    setPrefs(defaultPrefs)
    applyPrefs(defaultPrefs)
    announceChange('Configuración de accesibilidad restablecida correctamente')
  }

  // Keyboard: toggle with Enter/Space on floating button
  function onToggle(e){
    if(e.type === 'keydown' && (e.key !== 'Enter' && e.key !== ' ')) return
    setOpen(v=>!v)
  }

  return (
    <>
      {/* The panel rendered inline inside Pedidos/Carrito container */}
      <section id="accessibility-section" className={`aw-panel ${open? 'open':''}`} role="region" aria-labelledby="accessibility-section-title" aria-live="polite">
        <div className="aw-header" role="heading" aria-level={2} id="accessibility-section-title">Accesibilidad</div>

        <div className="aw-content">
          {/* Font size group */}
          <div className="aw-group" role="group" aria-labelledby="aw-font-title">
            <div className="aw-group-title" id="aw-font-title">Tamaño de fuente</div>
            <div className="aw-controls">
              <button ref={firstControlRef} className="aw-btn" aria-label="Disminuir tamaño de texto" onClick={()=>changeFontSize(-10)}>−</button>
              <div className="aw-indicator" role="status" aria-live="polite" aria-atomic="true">Tamaño de texto: {prefs.fontSize}%</div>
              <button className="aw-btn" aria-label="Aumentar tamaño de texto" onClick={()=>changeFontSize(10)}>+</button>
            </div>
            <div className="aw-subcontrols">
              <button className="aw-small" onClick={()=>setLineHeight(1.5)} aria-label="Interlineado 1.5">1.5</button>
              <button className="aw-small" onClick={()=>setLineHeight(2.0)} aria-label="Interlineado 2.0">2.0</button>
              <button className="aw-small" onClick={()=>setLineHeight(2.5)} aria-label="Interlineado 2.5">2.5</button>
            </div>
            <div className="aw-subcontrols">
              <button className="aw-small" onClick={()=>setParaSpacing(1)} aria-label="Espaciado de párrafos 1em">1em</button>
              <button className="aw-small" onClick={()=>setParaSpacing(1.5)} aria-label="Espaciado de párrafos 1.5em">1.5em</button>
              <button className="aw-small" onClick={()=>setParaSpacing(2)} aria-label="Espaciado de párrafos 2em">2em</button>
            </div>
          </div>

          {/* Contrast group */}
          <div className="aw-group" role="group" aria-labelledby="aw-contrast-title">
            <div className="aw-group-title" id="aw-contrast-title">Contraste</div>
            <div className="aw-radio-group" role="radiogroup" aria-labelledby="aw-contrast-title">
              {[
                {id:'normal',label:'Normal'},
                {id:'high',label:'Alto contraste'},
                {id:'inverted',label:'Contraste invertido'},
                {id:'grayscale',label:'Escala de grises'},
                {id:'low',label:'Bajo brillo'}
              ].map(opt=> (
                <button key={opt.id}
                  role="radio"
                  aria-checked={prefs.contrast===opt.id}
                  className={`aw-radio ${prefs.contrast===opt.id? 'aw-checked':''}`}
                  onClick={()=>setContrast(opt.id)}
                  aria-label={opt.label}
                >
                  <span className="aw-preview" aria-hidden="true"></span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Typography group */}
          <div className="aw-group" role="group" aria-labelledby="aw-type-title">
            <div className="aw-group-title" id="aw-type-title">Tipografía</div>
            <div className="aw-controls-col">
              <label className="aw-switch"><input type="checkbox" checked={prefs.dyslexic} onChange={toggleDyslexic} aria-label="Usar OpenDyslexic" /> Usar OpenDyslexic</label>
              <div className="aw-subcontrols">
                <button className="aw-small" onClick={()=>setLetterSpacing('normal')} aria-label="Espaciado normal">Espaciado Normal</button>
                <button className="aw-small" onClick={()=>setLetterSpacing('wide')} aria-label="Espaciado amplio">Amplio</button>
                <button className="aw-small" onClick={()=>setLetterSpacing('wider')} aria-label="Espaciado muy amplio">Muy amplio</button>
              </div>
              <div className="aw-subcontrols">
                <button className="aw-small" onClick={()=>setTextAlign('left')} aria-label="Alinear izquierda">Alinear izquierda</button>
                <button className="aw-small" onClick={()=>setTextAlign('justify')} aria-label="Justificado">Justificado</button>
              </div>
            </div>
          </div>

          <div className="aw-reset">
            <button className="aw-reset-btn" onClick={resetAll} aria-label="Restablecer todo">Restablecer todo</button>
          </div>

        </div>

        <div className="aw-live" aria-live="polite">{announce}</div>
      </section>

      {/* Floating button */}
      <button
        className="aw-floating"
        aria-label="Abrir opciones de accesibilidad"
        aria-controls="accessibility-section"
        aria-expanded={open}
        onClick={()=>setOpen(v=>!v)}
        onKeyDown={onToggle}
        title="Abrir opciones de accesibilidad"
      >
        {/* Inline SVG accessible icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
          <path fill="#fff" d="M12 2a2 2 0 110 4 2 2 0 010-4zm-1 7h2v7h2v2h-6v-2h2V9z" />
        </svg>
      </button>
    </>
  )
}
