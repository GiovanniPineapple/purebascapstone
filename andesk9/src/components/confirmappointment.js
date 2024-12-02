// src/components/confirmappointment.js

import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ConfirmAppointment = () => {
    const location = useLocation();
    const { user_id, address, dayOfWeek, comuna, timeSlot } = location.state || {};

    const handlePayment = async () => {
        try {
            await axios.post('/appointments/select-appointment', {
                user_id,
                address,
                day_of_week: dayOfWeek,
                comuna,
                time_slot: timeSlot
            });
            alert('Cita confirmada. Procede al pago.');
            // Redirigir al portal de pago
        } catch (error) {
            console.error('Error al confirmar la cita', error);
        }
    };

    return (
        <div>
            <h2>Confirmar Cita</h2>
            <p><strong>Usuario:</strong> {user_id}</p>
            <p><strong>Dirección:</strong> {address}</p>
            <p><strong>Día:</strong> {dayOfWeek}</p>
            <p><strong>Comuna:</strong> {comuna}</p>
            <p><strong>Hora:</strong> {timeSlot}</p>

            <button onClick={handlePayment}>Proceder al Pago</button>
        </div>
    );
};

export default ConfirmAppointment;
