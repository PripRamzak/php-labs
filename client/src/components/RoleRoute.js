import React from 'react';
import { Navigate } from 'react-router-dom';

export const RoleRoute = ({ children, role }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = !!user;

    return !isAuthenticated ? <Navigate to="/login" /> : user.role == role ? children : <Navigate to="/" />;
};
