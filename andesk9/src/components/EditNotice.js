import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditNotice = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    tipe_notice: '',
    name_notice: '',
    desct_notice: '',
  });
  const [noticeImage, setNoticeImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar los datos de la noticia o actividad actual
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/notices/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error al cargar la noticia o actividad:', error);
      }
    };

    fetchNotice();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setNoticeImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append('tipe_notice', formData.tipe_notice);
    form.append('name_notice', formData.name_notice);
    form.append('desct_notice', formData.desct_notice);
    if (noticeImage) form.append('noticeImage', noticeImage);

    try {
      await axios.put(`http://localhost:5000/notices/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Noticia o actividad actualizada con éxito.');
      navigate('/admin-notices'); // Redirigir a la vista de administración
    } catch (error) {
      console.error('Error al actualizar la noticia o actividad:', error);
      alert('Error al actualizar la noticia o actividad.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Editar Noticia o Actividad</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="tipe_notice" className="form-label">
            Tipo
          </label>
          <select
            id="tipe_notice"
            name="tipe_notice"
            className="form-control"
            value={formData.tipe_notice}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione...</option>
            <option value="noticia">Noticia</option>
            <option value="actividad">Actividad</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="name_notice" className="form-label">
            Título
          </label>
          <input
            type="text"
            id="name_notice"
            name="name_notice"
            className="form-control"
            value={formData.name_notice}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="desct_notice" className="form-label">
            Descripción
          </label>
          <textarea
            id="desct_notice"
            name="desct_notice"
            className="form-control"
            rows="4"
            value={formData.desct_notice}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="noticeImage" className="form-label">
            Imagen
          </label>
          <input
            type="file"
            id="noticeImage"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </form>
    </div>
  );
};

export default EditNotice;