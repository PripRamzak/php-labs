import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import Cities from '../components/Cities';
import Airlines from '../components/Airlines';
import { fetchCities } from '../http/cityApi';
import { fetchAirlines } from '../http/airlinesApi';
import DispatcherRequests from '../components/DispatcherRequests';
import { fetchRequests } from '../http/dispatcherRequestApi';
import { fetchUsers } from '../http/userApi';
import Dispatchers from '../components/Dispatchers';
import Tickets from '../components/Tickets';
import Orders from '../components/Orders';
import { fetchDispatcherByUserId } from '../http/dispatchersApi';

const Dispatcher = observer(() => {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : 0;

    const [cities, setCities] = useState([]);
    const [airlines, setAirlines] = useState([]);

    const [dispatcher, setDispatcher] = useState({});

    const getCities = async () => {
        try {
            const data = await fetchCities();
            if (Array.isArray(data)) {
                setCities(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
    };

    const getAirlines = async () => {
        try {
            const data = await fetchAirlines();
            if (Array.isArray(data)) {
                setAirlines(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
    };

    const getDispatcher = async () => {
        try {
            const data = await fetchDispatcherByUserId(userId);
            setDispatcher(data);
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
    }

    useEffect(() => {
        getCities();
        getAirlines();
        getDispatcher();
    }, []);


    return (
        <Container>
            <Tickets cities={cities} airlines={airlines} dispatcher={dispatcher} dispatcherPanel={true} />
            <Orders cities={cities} airlines={airlines} dispatcher={dispatcher} dispatcherPanel={true} />
        </Container >
    );
})

export default Dispatcher;
