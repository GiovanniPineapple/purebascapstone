import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Calendar.css'; // Asegúrate de que el CSS esté en la ruta correcta

const AdminCalendar = () => {
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    const fetchAvailableHours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/appointments/available-hours-nc');
        
        // Agrupar los horarios por día de la semana
        const groupedByDay = response.data.reduce((acc, hour) => {
          const day = hour.day_of_week; // Lunes, Martes, etc.
          if (!acc[day]) acc[day] = [];
          acc[day].push(hour);
          return acc;
        }, {});

        // Formatear los horarios para mostrar el estado correctamente
        const formattedData = Object.keys(groupedByDay).map((day) => ({
          day,
          hours: groupedByDay[day].map((hour) => ({
            ...hour,
            is_available_text: hour.is_available === 1 ? 'Libre' : 'En uso', // Mostrar si está libre o en uso
          }))
        }));
        
        setAvailableHours(formattedData); // Guardar los horarios disponibles agrupados
      } catch (error) {
        console.error('Error al obtener los horarios disponibles:', error);
      }
    };

    fetchAvailableHours();
  }, []);

  // Eliminar un horario seleccionado
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/appointments/delete-available-hour/${id}`);
      setAvailableHours((prev) => prev.map((day) => ({
        ...day,
        hours: day.hours.filter((hour) => hour.id_available_hour !== id),
      })));
      alert('Horario eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el horario:', error);
      alert('Error al eliminar el horario.');
    }
  };

  // Modificar el estado de disponibilidad (is_available) de un horario
  const handleModify = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 2 : 1; // Cambiar entre 1 (Libre) y 2 (En uso)

    try {
      await axios.put(`http://localhost:5000/appointments/update-available-hour/${id}`, {
        is_available: newStatus, // Solo cambiar el estado de is_available
      });

      setAvailableHours((prev) =>
        prev.map((day) => ({
          ...day,
          hours: day.hours.map((hour) =>
            hour.id_available_hour === id
              ? { ...hour, is_available: newStatus, is_available_text: newStatus === 1 ? 'Libre' : 'En uso' }
              : hour
          ),
        }))
      );
      alert('Estado del horario actualizado correctamente.');
    } catch (error) {
      console.error('Error al modificar el horario:', error);
      alert('Error al modificar el horario.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Gestión de Horarios Disponibles</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Día</th>
            <th>Horarios</th>
          </tr>
        </thead>
        <tbody>
          {availableHours.map((dayData) => (
            <tr key={dayData.day}>
              <td>{dayData.day}</td>
              <td>
                {dayData.hours.map((hour) => (
                  <div key={hour.id_available_hour} className={`calendar-cell ${hour.is_available === 1 ? 'free' : 'occupied'}`} onClick={() => setSelectedHour(hour)}>
                    {`${hour.time_slot} (${hour.is_available_text})`}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedHour && (
        <div className="mt-4">
          <h3>Opciones para el horario seleccionado</h3>
          <p>
            {`Comuna: ${selectedHour.comuna}, Hora: ${selectedHour.time_slot}, Estado: ${selectedHour.is_available_text}`}
          </p>
          <button className="btn btn-danger me-2" onClick={() => handleDelete(selectedHour.id_available_hour)}>
            Eliminar
          </button>
          <button className="btn btn-warning" onClick={() => handleModify(selectedHour.id_available_hour, selectedHour.is_available)}>
            Modificar
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
