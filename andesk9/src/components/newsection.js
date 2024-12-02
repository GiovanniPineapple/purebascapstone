import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewsSection = () => {
  const [activities, setActivities] = useState([]); // Estado para almacenar las actividades

  // Cargar las últimas 3 actividades desde la base de datos
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/lastnotices'); // Endpoint para obtener las actividades
        setActivities(response.data); // Asumimos que la respuesta es un array de actividades
      } catch (error) {
        console.error('Error al cargar las actividades:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <section className="container mt-5">
      <h2 className="text-center mb-4">Últimas Actividades</h2>
      <div className="row">
        {activities.slice(0, 3).map((activity) => ( // Mostrar las 3 últimas actividades
          <div key={activity.id_notice} className="col-md-4">
            <div className="card">
              <img
                src={`http://localhost:5000/${activity.notice_image_path}`} // Suponemos que la imagen está en esta ruta
                className="card-img-top"
                alt={activity.name_notice}
              />
              <div className="card-body">
                <h5 className="card-title">{activity.name_notice}</h5>
                <p className="card-text">
                  {activity.desct_notice.length > 100
                    ? activity.desct_notice.slice(0, 100) + '...' // Limita la descripción a 100 caracteres
                    : activity.desct_notice}
                </p>
                <Link to={`/notice/${activity.id_notice}`} className="btn btn-primary">
                  Leer más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
