import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { deleteRequest, fetchRequests, updateRequest } from '../http/dispatcherRequestApi';
import ErrorModal from './modals/Error';

const DispatcherRequests = observer(({loading, setLoading, airlines, users }) => {
    const [requests, setRequests] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    const getRequests = async () => {
        try {
            const data = await fetchRequests();
            if (Array.isArray(data)) {
                setRequests(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            setErrorMessage(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
            setErrorModalVisible(true);
        }
        finally{
            if (loading)
                setLoading(false)
        }
    };


    useEffect(() => {
        getRequests();
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

    const getFullName = (requestId) => {
        const request = requests.find(request => request.id === requestId);
        return request.surname + " " + request.firstname + " " + request.middlename;
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

    const getStatus = (status) => {
        switch (status) {
            case 'approved':
                return 'Одобрено';
            case 'denied':
                return 'Отказано';
            case 'pending':
                return 'В ожидании';
        }
    }

    const handleUpdate = async (requestId, newStatus) => {
        try {
            const result = await updateRequest(requestId, { status: newStatus });
            if (result.error) {
                setErrorMessage(result.error);
                setErrorModalVisible(true);
                return;
            }
            getRequests();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    const handleDelete = async (requestId) => {
        try {
            await deleteRequest(requestId);
            getRequests();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    if (loading)
        return;

    return (
        <Container>
            <h4 className='mt-2 text-center'>Запросы на работу диспетчером</h4>
            <Table bordered className='mt-2'>
                <thead>
                    <tr>
                        <th>Логин</th>
                        <th>ФИО</th>
                        <th>Авиакомпания</th>
                        <th>Статус</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {
                        requests.map(request =>
                            <tr key={request.id}>
                                <td>{getLogin(request.user_id)}</td>
                                <td>{getFullName(request.id)}</td>
                                <td>{getAirline(request.airline_id)}</td>
                                <td>{getStatus(request.status)}</td>
                                {request.status == 'pending' ?
                                    <td>
                                        <Button onClick={() => { handleUpdate(request.id, 'approved'); }}>
                                            Одобрить
                                        </Button>
                                        <Button
                                            className='ms-3'
                                            variant='outline-danger'
                                            onClick={() => { handleUpdate(request.id, 'denied'); }}>
                                            Отказать
                                        </Button>
                                    </td>
                                    :
                                    <td>
                                        <Button className='ms-3' variant='dark' onClick={() => { handleDelete(request.id); }}>
                                            Удалить
                                        </Button>
                                    </td>
                                }
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            <ErrorModal show={errorModalVisible} onHide={() => setErrorModalVisible(false)} error={errorMessage} />
        </Container >
    );
})

export default DispatcherRequests;
