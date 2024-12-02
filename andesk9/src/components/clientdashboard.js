import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClienteDashboard = () => {
  const navigate = useNavigate();

  const handleNotices = () => {
    navigate('/noticias');
  };

  const handlePayment = () => {
    navigate('/payment');
  };

  const handleConfirmAppointment = () => {
    navigate('/confirm-appointment');
  };

  const handleSelectAppointment = () => {
    navigate('/select-appointment');
  };

  const handleServiceListCard = () => {
    navigate('/servicelistCard');
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard de Cliente</h1>
      <div className="dashboard-buttons">
        <button onClick={handleNotices}>Ver Noticias</button>
        <button onClick={handlePayment}>Realizar Pago</button>
        <button onClick={handleConfirmAppointment}>Confirmar Cita</button>
        <button onClick={handleSelectAppointment}>Seleccionar Cita</button>
        <button onClick={handleServiceListCard}>Ver Servicios</button>
      </div>
    </div>
  );
};

export default ClienteDashboard;
