import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, requiredRoles, children }) => {
    if (!requiredRoles.includes(role)) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;
