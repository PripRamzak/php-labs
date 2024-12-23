import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { fetchCities } from '../http/cityApi';
import { API_URL } from '../utils/consts';
import CityCard from '../components/CityCard';

const Cities = observer(() => {
    const [cities, setCities] = useState([])

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

    useEffect(() => {
        getCities();
    }, [])

    return (
        <Container>
            <Row>
                {cities.map(city =>
                    <Col key={city.id} className='mt-3' md={4}>
                        <CityCard city={city} />
                    </Col>
                )}
            </Row>
        </Container>
    );
})

export default Cities;