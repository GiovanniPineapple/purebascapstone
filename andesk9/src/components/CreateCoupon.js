import React, { useState } from 'react';
import axios from 'axios';

const CreateCoupon = () => {
    const [codeCoupon, setCodeCoupon] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [status, setStatus] = useState(true); // Activo por defecto
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!codeCoupon || !discountPercent) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/create-coupon', {
                code_coupon: codeCoupon,
                discount_percent: discountPercent,
                status
            });
            alert('Cupón creado exitosamente');
            setCodeCoupon('');
            setDiscountPercent('');
            setStatus(true);
            setError('');
        } catch (err) {
            console.error('Error al crear el cupón:', err);
            setError('Error al crear el cupón. Intenta nuevamente.');
        }
    };

    return (
        <div>
            <h2>Crear Cupón de Descuento</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Código de Cupón:</label>
                <input
                    type="text"
                    value={codeCoupon}
                    onChange={(e) => setCodeCoupon(e.target.value)}
                    required
                />
                <label>Descuento (%):</label>
                <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    required
                />
                <label>Estado:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value === 'true')}>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
                <button type="submit">Crear Cupón</button>
            </form>
        </div>
    );
};

export default CreateCoupon;
