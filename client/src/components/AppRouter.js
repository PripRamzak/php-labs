import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import NavBar from './NavBar';
import Login from '../pages/Login';
import Registration from '../pages/Registration';
import { PrivateRoute } from './PrivateRoute';
import Main from '../pages/Main';

const AppRouter = observer(() => {

    return (
        <Routes>
            {/* {isLogin && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element=
                    {
                        <>
                            <NavBar />
                            <Component />
                        </>
                    } 
                exact />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            <Route path="*" element={<Navigate to={LOGIN_ROUTE} replace />}
            /> */}
            <Route path={LOGIN_ROUTE} element={<Login />} />
            <Route path={REGISTRATION_ROUTE} element={<Registration />} />
            <Route path={MAIN_ROUTE} element=
                {
                    <PrivateRoute>
                        <NavBar />
                        <Main />
                    </PrivateRoute>
                }>
            </Route>
        </Routes>
    )
})

export default AppRouter;
