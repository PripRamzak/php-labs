import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { fetchCities } from '../http/cityApi';
import { fetchAirlines } from '../http/airlinesApi';
import { fetchOrdersByUserId } from '../http/ordersApi';
import { fetchTickets } from '../http/ticketApi';
import CreateDispatcherRequest from '../components/modals/CreateDispatcherRequest';
import { fetchRequestByUserId } from '../http/dispatcherRequestApi';
import Orders from '../components/Orders';

const PersonalAccount = observer(() => {
    const user = localStorage.getItem('user');
    const role = user ? JSON.parse(user).role : 'null';
    const userId = user ? JSON.parse(user).id : 0;

    const [cities, setCities] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [request, setRequest] = useState({});
    const [requestModalVisible, setRequestModalVisible] = useState(false);

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

    const getRequest = async () => {
        try {
            const data = await fetchRequestByUserId(userId);
            setRequest(data);
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
    }

    useEffect(() => {
        getCities();
        getAirlines();
        getRequest();
    }, []);

    return (
        <Container>
            <Orders cities={cities} airlines={airlines} />
            {(!request && role != 'admin') &&
                (
                    <>
                        <h4 className='mt-4 text-center'>Вы сотрудник авиакомпании? Оставьте заявку</h4>
                        <Button className='d-block mx-auto' size='lg' variant='dark' onClick={() => setRequestModalVisible(true)}>Оставить заявку</Button>
                        <CreateDispatcherRequest show={requestModalVisible}
                            onHide={() => { setRequestModalVisible(false); getRequest(); }}
                            airlines={airlines}
                            userId={userId}
                        />
                    </>
                )
            }
        </Container >

    );
})

export default PersonalAccount;
