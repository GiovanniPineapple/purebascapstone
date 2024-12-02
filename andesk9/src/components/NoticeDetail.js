import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NoticeDetail = () => {
  const { id } = useParams(); // Obtener el id de la URL
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/notice/${id}`); // Hacer la solicitud para obtener la noticia por id
        setNotice(response.data); // Establecer los detalles de la noticia
      } catch (error) {
        console.error('Error al cargar los detalles de la noticia:', error);
      }
    };

    fetchNotice();
  }, [id]);

  if (!notice) return <div className="container text-center mt-5"><p>Cargando...</p></div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="text-center">{notice.name_notice}</h2>
          <div className="card shadow-sm mb-4">
            <div style={styles.cardImgContainer}>
              <img
                src={`http://localhost:5000/${notice.notice_image_path}`}
                alt={notice.name_notice}
                style={styles.cardImgFluid}
              />
            </div>
            <div className="card-body">
              <p className="card-text">{notice.desct_notice}</p>
            </div>
          </div>
          <a href="/" className="btn btn-primary">Volver a Noticias</a>
        </div>
      </div>
    </div>
  );
};

// Estilos en línea
const styles = {
  cardImgContainer: {
    display: 'flex',
    justifyContent: 'center', // Centra la imagen horizontalmente
    alignItems: 'center', // Centra la imagen verticalmente
    width: '100%',
    margin: '0', // Elimina los márgenes
    padding: '0', // Elimina los rellenos
    overflow: 'hidden',
    height: '300px', // Ajusta la altura de la imagen
  },
  cardImgFluid: {
    objectFit: 'cover', // Asegura que la imagen cubra el área sin distorsión
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    margin: '0 auto', // Asegura que la imagen esté centrada dentro de su contenedor
  },
};

export default NoticeDetail;
