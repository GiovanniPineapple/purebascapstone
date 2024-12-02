import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AppointmentAndPayment = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const id_user = localStorage.getItem("UserId");
  const userName = localStorage.getItem("userName");
  const email = localStorage.getItem('email'); 
  console.log("Correo del usuario:", email);
  const { service, servicePrice, durationWeeks, serviceId } = location.state || {};

  // Estado inicial para los datos de la cita
  const [appointmentData, setAppointmentData] = useState({
    availableHours: {},
    dayOfWeek: "",
    comuna: "",
    timeSlot: "",
    fullAddress: "",
    duration_weeks: durationWeeks || "",
    service: service || {},
    price: servicePrice || 0,
    service_id: serviceId || "",
  });

  const [loading, setLoading] = useState({ hours: true, payment: false });
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Limpiar y generar un nuevo buyOrder cada vez que se entra a la vista
  useEffect(() => {
    sessionStorage.removeItem("buyOrder"); // Elimina cualquier buyOrder previo
    const newBuyOrder = `order-${Math.floor(Math.random() * 1000000)}`; // Genera un nuevo buyOrder
    sessionStorage.setItem("buyOrder", newBuyOrder); // Guarda el nuevo buyOrder en sessionStorage
    console.log("Nuevo buyOrder generado:", newBuyOrder);
  }, []);

  // Fetch horarios disponibles
  useEffect(() => {
    const fetchAvailableHours = async () => {
      try {
        const response = await axios.get("http://localhost:5000/appointments/select-appointment");
        setAppointmentData((prev) => ({
          ...prev,
          availableHours: response.data,
        }));
      } catch (err) {
        setError("No se pudieron cargar los horarios disponibles.");
        console.error("Error al cargar horarios:", err.message);
      } finally {
        setLoading((prev) => ({ ...prev, hours: false }));
      }
    };

    fetchAvailableHours();
  }, []);

  // Obtener la fecha y hora completas
  const getFullDateTime = () => {
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return `${date} ${appointmentData.timeSlot}:00`;
  };

  // Confirmar cita y enviar al backend
  
  const handlePaymentConfirmation = async () => {
    const fullDateTime = getFullDateTime();
    const buyOrder = sessionStorage.getItem("buyOrder");
    const nameUser = localStorage.getItem("userName"); // Obtener el nombre del usuario desde localStorage o authData
    const email = localStorage.getItem("email"); // Asegúrate de que el correo también esté en localStorage o authData
  
    // Limpiar los datos, eliminando caracteres no deseados como saltos de línea o tabulaciones
    const fullAddress = appointmentData.fullAddress.trim(); // Eliminar espacios, saltos de línea, tabulaciones
  
    if (!appointmentData.comuna || !fullAddress || !appointmentData.timeSlot || !appointmentData.service_id) {
      setError('Faltan campos obligatorios para confirmar la cita.');
      return;
    }
  
    const payload = {
      id_user,
      service_id: appointmentData.service_id,
      address_appoin: appointmentData.comuna,
      full_address: appointmentData.fullAddress.trim(), 
      date_appoin: fullDateTime,
      service_price: parseFloat(appointmentData.price),
      status: 'En proceso',
      duration_weeks: parseInt(appointmentData.duration_weeks, 10),
      day_of_week: appointmentData.dayOfWeek,
      comuna: appointmentData.comuna,
      time_slot: appointmentData.timeSlot,
      buy_order: buyOrder,
      userName: nameUser,
      email: email || authData?.email || localStorage.getItem("email"), 
    };
    
    
  
    localStorage.setItem('appointmentData', JSON.stringify(payload));

    localStorage.setItem('servicePrice', appointmentData.price); 
    localStorage.setItem('dayOfWeek', appointmentData.dayOfWeek); 
    localStorage.setItem('timeSlot', appointmentData.timeSlot);
    try {
      const { data } = await axios.post('http://localhost:5000/initiate-payment', {
        amount: payload.service_price,
        appointmentId: payload.buy_order.split('-')[1],
      });
  
      if (data.success) {
        window.location.href = data.paymentUrl; // Redirigir al portal de pago
      } else {
        setError('No se pudo iniciar el pago.');
      }
    } catch (error) {
      setError('Error al procesar el pago. Intenta nuevamente.');
      console.error('Error al iniciar el pago:', error.message);
    }
  };
  // Renderizar las opciones del selector
  const renderAvailableOptions = (options, placeholder) => (
    <select
      className="form-select"
      onChange={(e) =>
        setAppointmentData((prev) => ({ ...prev, [placeholder]: e.target.value }))
      }
      value={appointmentData[placeholder]}
    >
      <option value="">{`Selecciona ${placeholder}`}</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Reservar Cita y Pago</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {paymentStatus && <div className="alert alert-success">{paymentStatus}</div>}

      {loading.hours ? (
        <p>Cargando horarios...</p>
      ) : (
        <>
          <form>
            <div className="mb-3">
              <label className="form-label">Día de la Semana:</label>
              {renderAvailableOptions(Object.keys(appointmentData.availableHours), "dayOfWeek")}
            </div>
            {appointmentData.dayOfWeek && (
              <div className="mb-3">
                <label className="form-label">Comuna:</label>
                {renderAvailableOptions(
                  Object.keys(appointmentData.availableHours[appointmentData.dayOfWeek]),
                  "comuna"
                )}
              </div>
            )}
            {appointmentData.comuna && (
              <div className="mb-3">
                <label className="form-label">Horario:</label>
                {renderAvailableOptions(
                  appointmentData.availableHours[appointmentData.dayOfWeek][appointmentData.comuna],
                  "timeSlot"
                )}
              </div>
            )}
            {appointmentData.timeSlot && (
              <div className="mb-3">
                <label className="form-label">Dirección completa:</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setAppointmentData({ ...appointmentData, fullAddress: e.target.value })}
                  required
                />
              </div>
            )}
          </form>

          {appointmentData.fullAddress && (
            <button
              className="btn btn-success"
              onClick={handlePaymentConfirmation}
              disabled={!appointmentData.timeSlot || !appointmentData.fullAddress}
            >
              Confirmar y Pagar
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentAndPayment;
