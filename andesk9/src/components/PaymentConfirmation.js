import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentConfirmation = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const token_ws = params.get('token_ws');

      if (!token_ws) {
        setError('No se encontró el token de pago.');
        return;
      }

      try {
        const response = await axios.post('/api/pay/confirm', { token_ws });
        // Redirige basado en el resultado
        const { order } = response.data;
        navigate(`/confirmation?order=${order}`);
      } catch (error) {
        setError('Hubo un problema con la confirmación del pago.');
        console.error(error);
        navigate('/payment-failed');
      }
    };

    confirmPayment();
  }, [navigate]);

  return (
    <div>
      <h2>Confirmando Pago...</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PaymentConfirmation;
