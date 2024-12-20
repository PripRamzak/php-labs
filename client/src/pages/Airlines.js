import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { fetchCities } from '../http/cityApi';
import { API_URL } from '../utils/consts';
import { fetchAirlineImage, fetchAirlines } from '../http/airlinesApi';

const Airlines = observer(() => {
    const [airlines, setAirlines] = useState([])
    const [images, setImages] = useState([])

    const loadImages = async (airlines) => {
        const newImages = {};

        for (const airline of airlines) {
            const airline_img = await fetchAirlineImage(airline.id);
            console.log(airline_img);
            if (airline_img) {
                const blob = new Blob([airline_img], { type: 'image/jpeg' }); // Убедитесь, что тип изображения правильный
                const reader = new FileReader();

                reader.onloadend = () => {
                    newImages[airline.id] = reader.result; // Сохраняем Data URL
                    setImages(prev => ({ ...prev, ...newImages }));
                    console.log(reader.result);
                };

                reader.readAsDataURL(blob);
                console.log(blob)
            }
        }
    };

    const getAirlines = async () => {
        try {
            const data = await fetchAirlines();
            if (Array.isArray(data)) {
                setAirlines(data);
                loadImages(data)
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
    };


    useEffect(() => {
        getAirlines();
    }, [])

    return (
        <Container>
            <Row>
                {airlines.map(airline =>
                    <Col key={airline.id} className='mt-3' md={4}>
                        <Card className="text-center" style={{ width: 350, borderWidth: '2px' }}>
                            <Card.Body>
                                <Card.Title className='d-flex justify-content-center'>{airline.name}</Card.Title>
                                {images[airline.id] &&
                                    <Card.Img className='mt-1' width={300} height={200} src={images[airline.id]} />}
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
})

export default Airlines;