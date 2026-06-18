Resumen
- Proyecto convertido a React + Vite minimal.

Instrucciones rápidas
1. Desde la carpeta 'Suplemento Gym Pro' ejecutar:

```bash
npm install
npm run dev
```

2. Copia la carpeta `Imagenes` (actualmente en el proyecto original) dentro de la carpeta raíz del proyecto (`Suplemento Gym Pro/Imagenes`) para que las rutas `/Imagenes/*` funcionen en desarrollo.

Notas
- Los estilos originales se copiaron a `src/styles/estiloPrueba.css` y `src/styles/estiloRegistro.css`.
- La lógica JS original está en `src/js/app.js` y se expone mediante `initApp()`; cada página llama a `initApp()` en `useEffect` para enlazar listeners.
- Si quieres que las imágenes estén en `public/Imagenes`, muévelas allí y actualiza las rutas si es necesario.
