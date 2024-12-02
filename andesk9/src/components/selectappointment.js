import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SelectAppointment = () => {
    const { state } = useLocation();
    const { service } = state; // Servicio seleccionado
    const navigate = useNavigate();
    
    const [availableHours, setAvailableHours] = useState({});
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [comuna, setComuna] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [error, setError] = useState(''); // Para mostrar errores
    const [loading, setLoading] = useState(true); // Estado para manejar la carga

    useEffect(() => {
        const fetchAvailableHours = async () => {
            try {
                setLoading(true); // Inicia la carga
                const response = await axios.get('http://localhost:5000/appointments/select-appointment');
                setAvailableHours(response.data);
            } catch (error) {
                console.error('Error al cargar horarios disponibles', error);
                setError('No se pudieron cargar los horarios disponibles. Intenta nuevamente.');
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };
        fetchAvailableHours();
    }, []);

    const handleConfirmAppointment = () => {
        if (!dayOfWeek || !comuna || !timeSlot) {
            setError('Por favor, selecciona todos los campos.');
            return;
        }

        // Redirige al portal de pago con todos los datos relevantes
        navigate('/payment', {
            state: {
                service,
                appointmentDetails: {
                    dayOfWeek,
                    comuna,
                    timeSlot,
                },
            },
        });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Selecciona tu Cita</h2>
            {error && <p className="text-danger">{error}</p>} {/* Mostrar errores */}

            {/* Mostrar mensaje de carga si los horarios están siendo cargados */}
            {loading && <p>Loading...</p>}

            <form onSubmit={(e) => { e.preventDefault(); handleConfirmAppointment(); }}>
                {/* Día de la semana */}
                <div className="mb-3">
                    <label htmlFor="dayOfWeek" className="form-label">Día de la Semana:</label>
                    <select
                        id="dayOfWeek"
                        className="form-select"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un día</option>
                        {Object.keys(availableHours).map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>

                {/* Comuna */}
                {dayOfWeek && (
                    <div className="mb-3">
                        <label htmlFor="comuna" className="form-label">Comuna:</label>
                        <select
                            id="comuna"
                            className="form-select"
                            value={comuna}
                            onChange={(e) => setComuna(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una comuna</option>
                            {Object.keys(availableHours[dayOfWeek]).map(com => (
                                <option key={com} value={com}>{com}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Horario */}
                {comuna && (
                    <div className="mb-3">
                        <label htmlFor="timeSlot" className="form-label">Horario:</label>
                        <select
                            id="timeSlot"
                            className="form-select"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un horario</option>
                            {availableHours[dayOfWeek][comuna].map((slot, index) => (
                                <option key={index} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Botón para confirmar la cita */}
                <button
                    type="submit"
                    className="btn btn-success w-100 mt-3"
                    disabled={!dayOfWeek || !comuna || !timeSlot}
                >
                    Confirmar Cita
                </button>
            </form>
        </div>
    );
};

export default SelectAppointment;
