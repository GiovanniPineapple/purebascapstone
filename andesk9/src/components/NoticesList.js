import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NoticesList = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar noticias y actividades
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/notice');
        setNotices(response.data);
      } catch (error) {
        console.error('Error al cargar noticias y actividades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Eliminar una noticia o actividad
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta noticia o actividad?')) {
      try {
        await axios.delete(`http://localhost:5000/notice/${id}`);
        setNotices(notices.filter((notice) => notice.id_notice !== id)); // Actualizar lista local
        alert('Noticia o actividad eliminada con éxito.');
      } catch (error) {
        console.error('Error al eliminar la noticia o actividad:', error);
        alert('Error al eliminar la noticia o actividad.');
      }
    }
  };

  // Redirigir al formulario de edición
  const handleEdit = (id) => {
    navigate(`/edit-notice/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Gestión de Noticias y Actividades</h2>
      {loading ? (
        <p>Cargando noticias y actividades...</p>
      ) : (
        <div className="row">
          {notices.map((notice) => (
            <div key={notice.id_notice} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={`http://localhost:5000/${notice.notice_image_path}`}
                  alt={notice.name_notice}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{notice.name_notice}</h5>
                  <p className="card-text">{notice.desct_notice}</p>
                  <p className="card-text">
                    <strong>Tipo:</strong> {notice.tipe_notice}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(notice.id_notice)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(notice.id_notice)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticesList;
