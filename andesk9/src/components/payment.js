import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const { state } = useLocation(); // Recibe los datos desde la página anterior
  const navigate = useNavigate();

  // Manejar estado de error si los datos no están presentes
  const [hasError, setHasError] = useState(!state || !state.service || !state.appointmentDetails);

  // Información de la cita y servicio
  const { service, appointmentDetails } = state || {};

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Función para iniciar el pago con Webpay
  const initiatePayment = async () => {
    setLoading(true);
  
    const payload = {
      amount: appointmentDetails.discountedPrice,
      appointmentId: appointmentDetails.id_appoin,
    };
  
    console.log("Payload enviado a /initiate-payment:", payload);
  
    try {
      const response = await axios.post("http://localhost:5000/initiate-payment", payload);
  
      if (response.data.success) {
        const { paymentUrl, buyOrder } = response.data;
  
        // Guardar buyOrder en sessionStorage
        sessionStorage.setItem("buyOrder", buyOrder);
  
        console.log("Redirigiendo a:", paymentUrl);
  
        // Redirigir a Webpay
        window.location.href = paymentUrl;
      } else {
        setError("No se pudo iniciar el proceso de pago.");
      }
    } catch (err) {
      console.error("Error al iniciar el pago:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };
  

  // Función para verificar el pago después de la redirección de Webpay
  const verifyPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/verify-payment", {
        appointmentId: appointmentDetails.id_appoin,
        paymentDetails: {
          /* Detalles de la confirmación de pago de Webpay */
        },
      });

      if (response.data.success) {
        setPaymentStatus("Pago exitoso.");
        navigate("/success"); // Redirige a una página de éxito después del pago
      } else {
        setPaymentStatus("El pago no fue exitoso.");
        setError("Hubo un problema con el pago.");
      }
    } catch (err) {
      console.error("Error al verificar el pago", err);
      setError("Hubo un error al verificar el pago.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verifica el pago si el usuario ha sido redirigido de Webpay después de completar el pago
    if (window.location.search.includes("paymentSuccess")) {
      verifyPayment();
    }
  }, []);

  // Mostrar error si los datos no son válidos
  if (hasError) {
    return (
      <div className="container mt-4">
        <h2>Error</h2>
        <p>No se proporcionaron los datos necesarios para el pago.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Pago de Cita</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {paymentStatus && <div className="alert alert-success">{paymentStatus}</div>}

      {/* Mostrar los detalles del servicio y cita */}
      <div className="mb-3">
        <p>
          <strong>Servicio:</strong> {service.name}
        </p>
        <p>
          <strong>Precio:</strong>{" "}
          {new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(appointmentDetails?.discountedPrice || service.service_price)}
        </p>
      </div>

      {/* Botón para iniciar el pago */}
      {loading ? (
        <p>Cargando el proceso de pago...</p>
      ) : (
        <button className="btn btn-success" onClick={initiatePayment}>
          Pagar ahora
        </button>
      )}
    </div>
  );
};

export default Payment;
