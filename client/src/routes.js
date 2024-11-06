import Bank from './pages/Main';
import Login from './pages/Login'
import Registration from './pages/Registration';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, MAIN_ROUTE } from "./utils/consts";

export const authRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Bank
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    }
]