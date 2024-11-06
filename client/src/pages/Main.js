import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import Cities from '../components/Cities';
import Airlines from '../components/Airlines';
import Tickets from '../components/Tickets';
import { fetchCities } from '../http/cityApi';
import { fetchAirlines } from '../http/airlinesApi';

const Main = observer(() => {
    const [cities, setCities] = useState([]);
    const [airlines, setAirlines] = useState([]);

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

    console.log(cities);

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


    return (
        <Container>
            <Tickets cities={cities} airlines={airlines}/>
            <Cities cities={cities} getCities={getCities}/>
            <Airlines airlines={airlines} getAirlines={getAirlines}/>
        </Container >
    );
})

export default Main;
