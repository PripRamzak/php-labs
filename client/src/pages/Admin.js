import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import Cities from '../components/Cities';
import Airlines from '../components/Airlines';
import { fetchCities } from '../http/cityApi';
import { fetchAirlines } from '../http/airlinesApi';
import DispatcherRequests from '../components/DispatcherRequests';
import { fetchRequests } from '../http/dispatcherRequestApi';
import { fetchUsers } from '../http/userApi';
import Dispatchers from '../components/Dispatchers';
import Weights from '../components/Weights';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = observer(() => {
    const [cities, setCities] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingWeights, setLoadingWeights] = useState(true);
    const [loadingDispatchers, setLoadingDispatchers] = useState(true);
    const [loadingDispatchersRequests, setLoadingDispatchersRequests] = useState(true);


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

    useEffect(() => {
        if (!loadingWeights && !loadingDispatchers && !loadingDispatchersRequests)
            setLoading(false);
    }, [loadingWeights, loadingDispatchers, loadingDispatchersRequests])

    return (
        <Container>
            {loading && <LoadingSpinner />}
            <Weights loading={loading} setLoading={setLoadingWeights} />
            <Cities loading={loading} cities={cities} getCities={getCities} />
            <Airlines loading={loading} airlines={airlines} getAirlines={getAirlines} />
            <Dispatchers loading={loading} setLoading={setLoadingDispatchers} airlines={airlines} users={users} />
            <DispatcherRequests loading={loading} setLoading={setLoadingDispatchersRequests} airlines={airlines} users={users} />
        </Container >
    );
})

export default Admin;
