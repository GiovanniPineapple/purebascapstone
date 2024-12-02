import React, { useState } from 'react';
import axios from 'axios';

const CreateAvailableHour = () => {
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [comuna, setComuna] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [isAvailable, setIsAvailable] = useState(true); 
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verificar que todos los campos estén llenos
        if (!dayOfWeek || !comuna || !timeSlot) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        try {
            // Enviar los datos correctamente al backend
            await axios.post('http://localhost:5000/create-available-hour', {
                day_of_week: dayOfWeek,
                comuna: comuna,
                time_slot: timeSlot,
                is_available: isAvailable
            });
            alert('Horario creado exitosamente');
            // Resetear los campos
            setDayOfWeek('');
            setComuna('');
            setTimeSlot('');
            setIsAvailable(true);
            setError(''); 
        } catch (error) {
            console.error('Error al crear el horario:', error);
            setError('Error al crear el horario. Intenta nuevamente.');
        }
    };

    return (
        <div className="create-available-hour">
            <h2>Crear Horario Disponible</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>} 

            <form onSubmit={handleSubmit}>
                <label>Día de la Semana:</label>
                <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    required
                >
                    <option value="">Selecciona un día</option>
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                </select>

                <label>Comuna:</label>
                <select
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    required
                >
                    <option value="">Selecione una comuna</option>
                    <option value="Ñuñoa">Ñuñoa</option>
                    <option value="Macul">Macul</option>
                    <option value="Providencia">Providencia</option>
                    <option value="Las Condes">Las Condes</option>
                    <option value="Vitacura">Vitacura</option>
                    <option value="Otro">Otro (pedido especial)</option>
                </select>

                <label>Horario:</label>
                <input
                    type="time"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                />

                <button type="submit">Crear Horario</button>
            </form>
        </div>
    );
};

export default CreateAvailableHour;
