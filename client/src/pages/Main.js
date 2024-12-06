import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import Cities from '../components/Cities';
import Airlines from '../components/Airlines';
import Tickets from '../components/Tickets';
import { fetchCities } from '../http/cityApi';
import { fetchAirlines } from '../http/airlinesApi';
import LoadingSpinner from '../components/LoadingSpinner';

const Main = observer(() => {
    const [cities, setCities] = useState([]);
    const [airlines, setAirlines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingTickets, setLoadingTickets] = useState(true);

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

    useEffect(() => {
        getCities();
        getAirlines();
    }, []);

    useEffect(() => {
        if (!loadingTickets)
            setLoading(false);
    }, [loadingTickets])


    return (
        <Container>
            {loading && <LoadingSpinner />}
            <Tickets loading={loading} setLoading={setLoadingTickets} cities={cities} airlines={airlines} dispatcherPanel={false} />
        </Container >
    );
})

export default Main;
