import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleGoToDashboard = () => {
        navigate('/client-dashboard'); // Ruta al dashboard del cliente
    };

    const handleGoHome = () => {
        navigate('/'); // Ruta a la página de inicio
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Pago Exitoso</h1>
            <p>¡Gracias! Tu pago ha sido procesado con éxito.</p>
            <p>Recibirás un correo electrónico con los detalles de tu transacción.</p>
            <button onClick={handleGoToDashboard} style={{ margin: '10px' }}>
                Ir al Dashboard
            </button>
            <button onClick={handleGoHome} style={{ margin: '10px' }}>
                Volver al Inicio
            </button>
        </div>
    );
};

export default PaymentSuccess;
