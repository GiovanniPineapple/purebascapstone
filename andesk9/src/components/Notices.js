import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Notices = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/notices'); // Asegúrate de que la URL sea correcta
        setNotices(response.data);
      } catch (error) {
        console.error('Error al cargar noticias y actividades:', error);
      }
    };

    fetchNotices();
  }, []);

  const renderNotices = (type) => {
    return notices
      .filter((notice) => notice.tipe_notice === type)
      .map((notice) => (
        <div key={notice.id_notice} className="col-md-4">
          <div className="card">
            <img
              src={`http://localhost:5000/${notice.notice_image_path}`}
              alt={notice.name_notice}
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">{notice.name_notice}</h5>
              <p className="card-text">
                {notice.desct_notice.length > 100
                  ? notice.desct_notice.slice(0, 100) + '...' // Limita la descripción a 100 caracteres
                  : notice.desct_notice}
              </p>
              {/* Botón Ver Más que redirige al detalle de la noticia */}
              <Link to={`/notice/${notice.id_notice}`} className="btn btn-primary">
                Ver más
              </Link>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className="container mt-5">
      {/* Mostrar Noticias en la parte superior */}
      <h2 className="text-center mb-4">Últimas Noticias</h2>
      <div className="row">
        {renderNotices('noticia')}
      </div>

      {/* Mostrar Actividades en la parte inferior */}
      <h2 className="text-center mt-5 mb-4">Próximas Actividades</h2>
      <div className="row">
        {renderNotices('actividad')}
      </div>
    </div>
  );
};

export default Notices;
