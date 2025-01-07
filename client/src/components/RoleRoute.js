import React from 'react';
import { Navigate } from 'react-router-dom';
import { decryptData } from '../utils/crypro';

export const RoleRoute = ({ children, role }) => {
    const user = localStorage.getItem('user') ? decryptData(localStorage.getItem('user')) : null;
    const isAuthenticated = !!user;

    return !isAuthenticated ? <Navigate to="/login" /> : user.role == role ? children : <Navigate to="/" />;
};
