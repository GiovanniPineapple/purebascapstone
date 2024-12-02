import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get('http://localhost:5000/coupons');
                setCoupons(response.data);
            } catch (err) {
                console.error('Error al obtener los cupones:', err);
            }
        };
        fetchCoupons();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/coupons/${id}`);
            setCoupons(coupons.filter(coupon => coupon.id_coupon !== id));
        } catch (err) {
            console.error('Error al eliminar el cupón:', err);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await axios.put(`http://localhost:5000/coupons/${id}`, { status: !currentStatus });
            setCoupons(coupons.map(coupon =>
                coupon.id_coupon === id ? { ...coupon, status: !currentStatus } : coupon
            ));
        } catch (err) {
            console.error('Error al actualizar el estado:', err);
        }
    };

    return (
        <div>
            <h2>Lista de Cupones</h2>
            <ul>
                {coupons.map(coupon => (
                    <li key={coupon.id_coupon}>
                        {coupon.code_coupon} - {coupon.discount_percent}% - {coupon.status ? 'Activo' : 'Inactivo'}
                        <button onClick={() => handleToggleStatus(coupon.id_coupon, coupon.status)}>
                            Cambiar Estado
                        </button>
                        <button onClick={() => handleDelete(coupon.id_coupon)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CouponList;
