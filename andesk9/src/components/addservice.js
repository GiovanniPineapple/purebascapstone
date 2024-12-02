import React, { useState } from 'react';
import axios from 'axios';

const AddServiceForm = () => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [serviceImage, setServiceImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    const formData = new FormData();
    formData.append('serviceName', serviceName);
    formData.append('serviceDescription', serviceDescription);
    formData.append('servicePrice', servicePrice);
    formData.append('serviceDuration', serviceDuration);
    if (serviceImage) {
      formData.append('serviceImage', serviceImage);
    }
  
    console.log('Datos a enviar:', formData); // Verifica los datos que se envían
  
    try {
      const response = await axios.post('http://localhost:5000/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Respuesta del servidor:', response.data); // Verifica la respuesta del servidor
      setSuccess(response.data.message);
      // Reset form fields
      setServiceName('');
      setServiceDescription('');
      setServicePrice('');
      setServiceDuration('');
      setServiceImage(null);
    } catch (error) {
      console.error('Error al agregar el servicio:', error); // Muestra el error en consola
      setError(error.response ? error.response.data.message : 'Error al agregar el servicio.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Añadir Servicio</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Nombre del Servicio:</label>
          <input
            type="text"
            className="form-control"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción del Servicio:</label>
          <textarea
            className="form-control"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio del Servicio:</label>
          <input
            type="number"
            className="form-control"
            value={servicePrice}
            onChange={(e) => setServicePrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Duración del Servicio (en semanas):</label>
          <input
            type="number"
            className="form-control"
            value={serviceDuration}
            onChange={(e) => setServiceDuration(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen del Servicio:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setServiceImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Servicio</button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {success && <p className="text-success mt-3">{success}</p>}
    </div>
  );
};

export default AddServiceForm;
