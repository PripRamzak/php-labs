import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ADMIN_ROUTE, AIRLINES_ROUTE, CITIES_ROUTE, DISPATCHER_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, PERSONAL_ACCOUNT_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import NavBar from './NavBar';
import Login from '../pages/Login';
import Registration from '../pages/Registration';
import Main from '../pages/Main';
import Admin from '../pages/Admin';
import PersonalAccount from '../pages/PersonalAccount';
import { RoleRoute } from './RoleRoute';
import Dispatcher from '../pages/Dispatcher';
import Cities from '../pages/Cities';
import Airlines from '../pages/Airlines';

const AppRouter = observer(() => {

    return (
        <Routes>
            <Route path={MAIN_ROUTE} element={<Main />} />
            <Route path={CITIES_ROUTE} element={<Cities />} />
            <Route path={AIRLINES_ROUTE} element={<Airlines />} />
            <Route path={LOGIN_ROUTE} element={<Login />} />
            <Route path={REGISTRATION_ROUTE} element={<Registration />} />
            <Route path={PERSONAL_ACCOUNT_ROUTE} element={<PersonalAccount />} />
            <Route path={ADMIN_ROUTE} element=
                {
                    <RoleRoute role='admin'>
                        <Admin />
                    </RoleRoute>
                }>
            </Route>
            <Route path={DISPATCHER_ROUTE} element=
                {
                    <RoleRoute role='dispatcher'>
                        <Dispatcher />
                    </RoleRoute>
                }>
            </Route>
        </Routes>
    )
})

export default AppRouter;
