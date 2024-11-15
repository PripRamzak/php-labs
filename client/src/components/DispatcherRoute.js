import React from 'react';
import { Navigate } from 'react-router-dom';

export const DispatcherRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = !!user;

    return !isAuthenticated ? <Navigate to="/login" /> : user.role == 'dispatcher' ? children : <Navigate to="/" />;
};
