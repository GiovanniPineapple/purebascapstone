import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'reactstrap';

const ServiceList = () => {
  const [services, setServices] = useState([]);

  // Función para obtener la lista de servicios
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/services'); // Asegúrate de que esta URL sea correcta
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error al obtener servicios:', error);
      }
    };

    fetchServices();
  }, []);

  // Función para eliminar un servicio
  const deleteService = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/services/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Actualiza la lista de servicios después de eliminar
        setServices(services.filter(service => service.id_service !== id));
      } else {
        console.error('Error al eliminar el servicio:', response.status);
      }
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  };

  return (
    <Container>
      <h3 className="text-center mb-4">Lista de Servicios</h3>
      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Servicio</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id_service}>
              <td>{service.id_service}</td>
              <td>{service.service_name}</td>
              <td>{service.service_description}</td>
              <td>${service.service_price ? Number(service.service_price).toFixed(2) : 'N/A'}</td>
              <td>{service.service_duration} visitas</td>
              <td>
                {service.service_image_path ? (
                  <img
                    src={`http://localhost:5000/${service.service_image_path}`} // URL de la imagen
                    alt={`${service.service_name}`}
                    style={{ width: '50px', height: '50px', borderRadius: '5%' }}
                  />
                ) : (
                  <div style={{ width: '50px', height: '50px', borderRadius: '5%', backgroundColor: '#e0e0e0' }} />
                )}
              </td>
              <td>
                <Button color="danger" onClick={() => deleteService(service.id_service)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ServiceList;
