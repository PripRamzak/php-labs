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

const Admin = observer(() => {
    const [cities, setCities] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [users, setUsers] = useState([]);

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

    const getUsers = async () => {
        try {
            const data = await fetchUsers();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            // setErrorMessage(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
            // setErrorModalVisible(true);
        }
    };

    useEffect(() => {
        getCities();
        getAirlines();
        getUsers();
    }, []);


    return (
        <Container>
            <Cities cities={cities} getCities={getCities} />
            <Airlines airlines={airlines} getAirlines={getAirlines} />
            <Dispatchers airlines={airlines} users={users} />
            <DispatcherRequests airlines={airlines} users={users} />
        </Container >
    );
})

export default Admin;
