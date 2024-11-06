import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('user');

    return isAuthenticated ? children : <Navigate to="/login" />;
};
