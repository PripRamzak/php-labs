import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { fetchCities } from '../http/cityApi';
import { API_URL } from '../utils/consts';

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
                        <Card className="text-center" style={{ width: 350, borderWidth: '2px' }}>
                            <Card.Body>
                                <Card.Title className='d-flex justify-content-center'>{city.name}</Card.Title>
                                <Card.Img className='mt-1' width={300} height={200} src={API_URL + "../img/cities/" + city.img} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
})

export default Cities;