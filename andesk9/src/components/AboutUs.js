import React from 'react';

const AboutUs = () => {
    return (
        <div className="container py-5">
            {/* Sección de ¿Quiénes Somos? */}
            <div className="row bg-light p-4 rounded shadow-sm mb-5">
                <div className="col-md-6 mb-4 mb-md-0">
                    <h2 className="display-4 mb-4">¿Quiénes Somos?</h2>
                    <p className="lead">
                        En AndesK9, nos dedicamos a ofrecer servicios de alta calidad para el adiestramiento y bienestar de tu mascota. 
                        Con años de experiencia en el campo, nuestro equipo está compuesto por entrenadores y profesionales dedicados a asegurar que tu perro reciba la mejor atención.
                    </p>
                    <p>
                        Nuestra misión es brindar un ambiente seguro y estimulante para el desarrollo de tu mascota, promoviendo una educación basada en el respeto mutuo y el amor por los animales.
                    </p>
                    <p>
                        Con una variedad de programas y servicios diseñados para satisfacer las necesidades de cada perro y dueño, nos enorgullece ver cómo cada mascota progresa y se convierte en un miembro más de la familia.
                    </p>
                </div>
                <div className="col-md-6">
                    <img 
                        src="img/quienessomos.jpg" 
                        alt="Quiénes somos" 
                        className="img-fluid rounded shadow-lg mb-4 mb-md-0"
                    />
                </div>
            </div>

            {/* Sección "Conoce a nuestro equipo" */}
            <div className="row bg-light p-4 rounded shadow-sm mb-5">
                <div className="col text-center">
                    <h3 className="display-5 mb-3 ">Conoce a nuestro equipo</h3>
                    <p >
                        Nuestro equipo está formado por entrenadores certificados, veterinarios y expertos en comportamiento animal. Trabajamos en conjunto para asegurar que tu perro tenga la mejor experiencia posible.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
