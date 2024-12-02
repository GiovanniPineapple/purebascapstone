import React, { useState, useEffect } from 'react';

const PaymentResult = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const email = localStorage.getItem('email');
  const userName = localStorage.getItem('userName');

  // Obtener datos de la URL
  const queryParams = new URLSearchParams(window.location.search);
  const tokenWs = queryParams.get('token_ws'); // Token de Webpay
  const buyOrder = queryParams.get('buy_order') || sessionStorage.getItem('buyOrder'); // Recuperar el buyOrder

  const servicePrice = localStorage.getItem('servicePrice');
  const dayOfWeek = localStorage.getItem('dayOfWeek');
  const timeSlot = localStorage.getItem('timeSlot');

  // Función para enviar el correo de confirmación
  const sendConfirmationEmail = async (email, userName, servicePrice, dayOfWeek, timeSlot) => {
    if (!servicePrice || !dayOfWeek || !timeSlot) {
      console.error('Datos faltantes para el correo de confirmación.');
      return;
    }

    const emailData = {
      to: email,
      subject: 'Confirmación de Pago y Cita en AndesK9',
      text: `Estimad@ ${userName}, se ha realizado el pago de $${servicePrice} por su servicio en AndesK9, con citas para los días ${dayOfWeek} a las ${timeSlot}.`
    };

    try {
      const response = await fetch('http://localhost:5000/send-email-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        console.log('Correo de confirmación enviado correctamente');
      } else {
        console.error('Error al enviar el correo de confirmación');
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  };

  useEffect(() => {
    const appointmentData = JSON.parse(localStorage.getItem('appointmentData'));
    console.log('Datos recuperados de localStorage:', appointmentData);

    // Realizar la solicitud para guardar la cita en la base de datos
    const saveAppointmentToDatabase = async () => {
      const alreadySaved = sessionStorage.getItem('appointmentSaved');
      if (alreadySaved) {
        console.log('La cita ya ha sido guardada previamente.');
        setMessage('La cita ya fue guardada.');
        setSuccess(true);
        return;
      }

      try {
        // Hacer la solicitud POST
        const response = await fetch('http://localhost:5000/appointments/confirmappointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Respuesta del servidor:', data);
          setMessage(`La transacción con la orden ${buyOrder} se realizó correctamente.`);
          setSuccess(true);

          // Marcar como guardada para evitar duplicados
          sessionStorage.setItem('appointmentSaved', 'true');
        } else {
          setMessage('La transacción se realizó correctamente.');
          setSuccess(true);
        }

        // Enviar el correo de confirmación después de guardar la cita
        await sendConfirmationEmail(email, userName, servicePrice, dayOfWeek, timeSlot);

      } catch (error) {
        console.error('Error al guardar la cita:', error);
        setMessage('La transacción se realizó correctamente.');
        await sendConfirmationEmail(email, userName, servicePrice, dayOfWeek, timeSlot);
        setSuccess(true);
      } finally {
        localStorage.removeItem('appointmentData');
        sessionStorage.removeItem('buyOrder');
      }
    };

    saveAppointmentToDatabase();
  }, [tokenWs, buyOrder, email, userName, servicePrice, dayOfWeek, timeSlot]);

  return (
    <div className="container mt-5">
      {/* Solo mostrar el mensaje de éxito */}
      <div className={`alert text-center ${success ? 'alert-success' : 'alert-danger'}`} role="alert">
        {message}
      </div>
    </div>
  );
};

export default PaymentResult;
