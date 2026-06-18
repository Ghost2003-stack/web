import React, { useEffect } from 'react'
import { initApp } from '../js/app'
import Footer from '../components/Footer'

export default function Suplementos() {
  useEffect(() => {
    initApp()
  }, [])

  return (
    <>
    <main id="main-content">
      <p id="welcomeMessage" className="form-message" role="status" aria-live="polite"></p>

      <section className="carrusel">
        <h2>Carrusel de productos</h2>
        <div id="carouselExampleCaptions" className="carousel slide">
          <div className="carousel-indicators" role="tablist" aria-label="Indicadores del carrusel">
            <button type="button" className="active" aria-current="true" aria-label="Slide 1" role="tab"></button>
            <button type="button" aria-label="Slide 2" role="tab"></button>
            <button type="button" aria-label="Slide 3" role="tab"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/Imagenes/ImCarrusel_1.jpg" className="d-block w-100" alt="Suplemento Proteína Whey" />
            </div>
            <div className="carousel-item">
              <img src="/Imagenes/ImCarrusel_2.jpg" className="d-block w-100" alt="Suplemento Creatina" />
            </div>
            <div className="carousel-item">
              <img src="/Imagenes/ImCarrusel_3.jpg" className="d-block w-100" alt="Suplemento BCAA" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" id="anterior" aria-label="Diapositiva anterior">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" id="siguiente" aria-label="Diapositiva siguiente">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </section>

      <section className="productos" aria-labelledby="productos-title">
        <h2 id="productos-title">Productos destacados</h2>
        <p id="cartMessage" className="form-message" role="status" aria-live="polite"></p>

        <article className="producto">
          <img src="/Imagenes/Proteina.jpg" alt="Proteína Whey para recuperación muscular" />
          <div className="info">
            <h3>Proteína Whey</h3>
            <p>Proteína de alta calidad para recuperación muscular.</p>
            <div className="producto-acciones" aria-label="Detalles del producto Proteína Whey">
              <div className="precio">Precio: $30.000</div>
              <label htmlFor="cantidad1">Cantidad</label>
              <input type="number" id="cantidad1" name="cantidad1" className="cantidad-input" defaultValue={1} min={1} />
              <button type="button" data-product="Proteína Whey" data-price="30000" aria-label="Agregar Proteína Whey al carrito">Agregar al carrito</button>
            </div>
          </div>
        </article>

        <article className="producto">
          <img src="/Imagenes/Creatina.jpg" alt="Creatina monohidrato para fuerza y resistencia" />
          <div className="info">
            <h3>Creatina Monohidrato</h3>
            <p>Aumenta fuerza y resistencia en entrenamientos intensos.</p>
            <div className="producto-acciones" aria-label="Detalles del producto Creatina Monohidrato">
              <div className="precio">Precio: $40.000</div>
              <label htmlFor="cantidad2">Cantidad</label>
              <input type="number" id="cantidad2" name="cantidad2" className="cantidad-input" defaultValue={1} min={1} />
              <button type="button" data-product="Creatina Monohidrato" data-price="40000" aria-label="Agregar Creatina Monohidrato al carrito">Agregar al carrito</button>
            </div>
          </div>
        </article>

        <article className="producto">
          <img src="/Imagenes/Bcaa.jpg" alt="BCAA complex para rendimiento deportivo" />
          <div className="info">
            <h3>BCAA Complex</h3>
            <p>Aminoácidos ramificados para mayor rendimiento.</p>
            <div className="producto-acciones" aria-label="Detalles del producto BCAA Complex">
              <div className="precio">Precio: $15.000</div>
              <label htmlFor="cantidad3">Cantidad</label>
              <input type="number" id="cantidad3" name="cantidad3" className="cantidad-input" defaultValue={1} min={1} />
              <button type="button" data-product="BCAA Complex" data-price="15000" aria-label="Agregar BCAA Complex al carrito">Agregar al carrito</button>
            </div>
          </div>
        </article>
      </section>

      <section className="comparacion" aria-labelledby="comparacion-title">
        <h2 id="comparacion-title">Comparación de Suplementos</h2>
        <table>
          <caption>Comparación de beneficios y precios de suplementos</caption>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Beneficio Principal</th>
              <th scope="col">Precio Aproximado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Proteína Whey</td>
              <td>Recuperación muscular</td>
              <td>$30.000</td>
            </tr>
            <tr>
              <td>Creatina Monohidrato</td>
              <td>Fuerza y resistencia</td>
              <td>$40.000</td>
            </tr>
            <tr>
              <td>BCAA Complex</td>
              <td>Rendimiento y recuperación</td>
              <td>$15.000</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Contact section removed from products page. Contact form remains on the Contacto route/page. */}
    </main>
    <Footer />
    </>
  )
}
