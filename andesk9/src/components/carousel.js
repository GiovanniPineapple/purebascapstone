// components/Carousel.js
import React from 'react';

const Carousel = () => {
  return (
    <section id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="./img/dog1.jpg" className="d-block w-100" alt="Perro entrenado" />
          <div className="carousel-caption">
            <h3>Entrenamiento Canino</h3>
            <p>Tu perro listo para cualquier situación.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="img/dog2.jpg" className="d-block w-100" alt="Perros en la montaña" />
          <div className="carousel-caption">
            <h3>Rescate y Trabajo</h3>
            <p>Especialistas en perros de búsqueda y rescate.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="img/dog3.jpg" className="d-block w-100" alt="Perro y dueño" />
          <div className="carousel-caption">
            <h3>Amigos fieles</h3>
            <p>El vínculo perfecto entre perro y humano.</p>
          </div>
        </div>
      </div>
      <a className="carousel-control-prev" href="#heroCarousel" role="button" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next" href="#heroCarousel" role="button" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
    </section>
  );
};

export default Carousel;
