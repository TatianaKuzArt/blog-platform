import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './context/user-context';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    return user ? children : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;