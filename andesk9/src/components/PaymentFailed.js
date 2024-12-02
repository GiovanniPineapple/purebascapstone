import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
    const navigate = useNavigate();

    const handleRetryPayment = () => {
        navigate('/payment'); // Ruta para intentar el pago nuevamente
    };

    const handleGoHome = () => {
        navigate('/'); // Ruta a la página de inicio
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Pago Fallido</h1>
            <p>Lo sentimos, tu transacción no se pudo completar.</p>
            <p>Por favor, verifica tus datos e intenta nuevamente.</p>
            <button onClick={handleRetryPayment} style={{ margin: '10px' }}>
                Intentar Nuevamente
            </button>
            <button onClick={handleGoHome} style={{ margin: '10px' }}>
                Volver al Inicio
            </button>
        </div>
    );
};

export default PaymentFailed;
