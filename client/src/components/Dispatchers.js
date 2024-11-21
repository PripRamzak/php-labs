import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { deleteTicket, fetchTickets } from '../http/ticketApi';
import CreateTicket from './modals/CreateTicket';
import UpdateTicket from './modals/UpdateTicket';
import { SearchInput } from './SearchInput';
import CreateOrder from './modals/CreateOrder';
import { deleteRequest, fetchRequests, updateRequest } from '../http/dispatcherRequestApi';
import { fetchUsers, updateUser } from '../http/userApi';
import ErrorModal from './modals/Error';
import { deleteDispatcher, fetchDispatchers } from '../http/dispatchersApi';

const Dispatchers = observer(({ airlines, users }) => {
    const [dispatchers, setDispatchers] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    const getDispatchers = async () => {
        try {
            const data = await fetchDispatchers();
            if (Array.isArray(data)) {
                setDispatchers(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            setErrorMessage(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
            setErrorModalVisible(true);
        }
    };

    useEffect(() => {
        getDispatchers();
    }, [airlines]);

    const getLogin = (userId) => {
        if (users.length === 0)
            return '';
        try {
            const user = users.find(user => user.id === userId);
            return user ? user.username : '';
        }
        catch (e) {
            return '';
        }
    }

    const getFullName = (dispatcherId) => {
        const dispatcher = dispatchers.find(dispatcher => dispatcher.id === dispatcherId);
        return dispatcher.surname + " " + dispatcher.firstname + " " + dispatcher.middlename;
    }

    const getAirline = (airlineId) => {
        if (airlines.length === 0)
            return '';
        try {
            const airline = airlines.find(airline => airline.id === airlineId);
            return airline ? airline.name : '';
        }
        catch (e) {
            return '';
        }
    }

    const handleDelete = async (requestId) => {
        try {
            await deleteDispatcher(requestId);
            getDispatchers();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    return (
        <Container>
            <h4 className='mt-2 text-center'>Диспетчеры</h4>
            <Table bordered className='mt-2'>
                <thead>
                    <tr>
                        <th>Логин</th>
                        <th>ФИО</th>
                        <th>Авиакомпания</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {
                        dispatchers.map(dispatcher =>
                            <tr key={dispatcher.id}>
                                <td>{getLogin(dispatcher.user_id)}</td>
                                <td>{getFullName(dispatcher.id)}</td>
                                <td>{getAirline(dispatcher.airline_id)}</td>
                                <td>
                                    <Button className='ms-3' variant='dark' onClick={() => { handleDelete(dispatcher.id); }}>
                                        Лишить прав
                                    </Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            <ErrorModal show={errorModalVisible} onHide={() => setErrorModalVisible(false)} error={errorMessage} />
        </Container >
    );
})

export default Dispatchers;
