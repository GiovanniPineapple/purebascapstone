import React, { useState } from 'react';
import axios from 'axios';

const PaymentInitiation = ({ serviceId, amount, userId }) => {
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      const response = await axios.post('/api/pay/start', { serviceId, amount, userId });
      const { url, token } = response.data;
      // Redirige a Webpay con el token
      window.location.href = `${url}?token_ws=${token}`;
    } catch (error) {
      setError('Hubo un problema al iniciar el pago. Inténtalo nuevamente.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Confirmar Pago</h2>
      <button onClick={handlePayment}>Pagar ahora</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PaymentInitiation;
