import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { fetchCities } from '../http/cityApi';
import { fetchAirlines } from '../http/airlinesApi';
import CreateDispatcherRequest from '../components/modals/CreateDispatcherRequest';
import { fetchRequestByUserId } from '../http/dispatcherRequestApi';
import Orders from '../components/Orders';
import DispatcherNotification from '../components/modals/DispatcherNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { decryptData } from '../utils/crypro';

const PersonalAccount = observer(() => {
    const user = localStorage.getItem('user') ? decryptData(localStorage.getItem('user')) : null;
    const role = user ? user.role : 'null';
    const userId = user ? user.id : 0;

    const [cities, setCities] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [request, setRequest] = useState(null);
    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);

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
            if (data != false) {
                setRequest(data);
                setNotificationVisible(data.status != 'pending');
            }
            else {
                setRequest(null);
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
    }

    useEffect(() => {
        getCities();
        getAirlines();
        getRequest();
    }, []);

    useEffect(() => {
        if (!loadingTickets && !loadingOrders)
            setLoading(false);
    }, [loadingTickets, loadingOrders])

    return (
        <Container>
            {loading && <LoadingSpinner />}
            <Orders loading={loading} setLoadingTickets={setLoadingTickets} setLoadingOrders={setLoadingOrders} cities={cities} airlines={airlines} />
            {(!request && role == 'user') &&
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
            <DispatcherNotification show={notificationVisible}
                onHide={() => { setNotificationVisible(false); }}
                request={request}
            />
        </Container >

    );
})

export default PersonalAccount;
