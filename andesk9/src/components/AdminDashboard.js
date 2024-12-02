import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleUserManagement = () => {
        navigate('/userlist');
    };

    const handleUserFormManagement = () => {
        navigate('/formuser');
    };

    const handleServiceManagement = () => {
        navigate('/servicelist');
    };
    const handleaddserviceManagement = () => {
        navigate('/addservice');
    };
    
    const handleAppointments = () => {
        navigate('/createavailablehour');
    };
    const handleCouponList = () => {
        navigate('/CouponList');
    };
    const handleCreateCoupon = () => {
        navigate('/CreateCoupon');
    };

    const handleAdminCalendar = () => {
        navigate('/AdminCalendar');
    };

    return (
        <div className="container mt-5">
            <h1>Panel de Administración</h1>
            <div className="d-grid gap-3">
                <button className="btn btn-primary" onClick={handleUserManagement}>Lista de usuarios</button>
                <button className="btn btn-secondary" onClick={handleUserFormManagement}>Formulario de usuarios</button>
                <button className="btn btn-success" onClick={handleaddserviceManagement}>Formulario de Servicios</button>
                <button className="btn btn-info" onClick={handleServiceManagement}>Gestión de Servicios</button>
                <button className="btn btn-warning" onClick={handleAppointments}>Crear horas</button>
                <button className="btn btn-warning" onClick={handleAdminCalendar}>Calendario</button>
                <button className="btn btn-danger" onClick={handleCouponList}>Lista de Cupones</button>
                <button className="btn btn-dark" onClick={handleCreateCoupon}>Crear cupon</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
