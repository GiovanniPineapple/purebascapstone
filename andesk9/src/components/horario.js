import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Calendar.css'; // Asegúrate de que el CSS esté en la ruta correcta

const Horario = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Traer solo las citas con estado 'Pagado' desde el backend
        const response = await axios.get('http://localhost:5000/appointments/calendar');
        setAppointments(response.data); // Los eventos de las citas
      } catch (error) {
        console.error('Error al cargar las citas:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Calendario de Citas</h2>
      <div className="calendar-grid">
        {appointments.map((dayData) => (
          <div key={dayData.day} className="calendar-day">
            <h3>{dayData.day}</h3>
            {dayData.appointments.map((appointment) => (
              <div key={appointment.id_appoin} className="calendar-cell">
                <p><strong>Dirección:</strong> {appointment.address_appoin}</p>
                <p><strong>Dirección Completa:</strong> {appointment.full_address}</p>
                <p><strong>Nombre:</strong> {appointment.Name}</p>
                <p><strong>Estado:</strong> Pagado</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Horario;
