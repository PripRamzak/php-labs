import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { deleteCity } from '../http/cityApi';
import CreateCity from './modals/CreateCity';
import UpdateCity from './modals/UpdateCity';
import { SearchInput } from './SearchInput';
import { fetchTickets } from '../http/ticketApi';
import { deleteOrder, fetchOrders, fetchOrdersByUserId, updateOrder } from '../http/ordersApi';

const Orders = observer(({ cities, airlines, dispatcher, dispatcherPanel = false }) => {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : 0;

    const [orders, setOrders] = useState([]);
    const [tickets, setTickets] = useState([]);

    const getTickets = async () => {
        try {
            const data = await fetchTickets();
            if (Array.isArray(data)) {
                setTickets(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
    };

    const getOrders = async () => {
        try {
            const data = dispatcherPanel ? await fetchOrders() : await fetchOrdersByUserId(userId);
            if (Array.isArray(data)) {
                console.log(data);
                setOrders(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
    };

    const getFullName = (orderId) => {
        const order = orders.find(order => order.id === orderId);
        return order.surname + " " + order.firstname + " " + order.middlename;
    }

    const getDepartureCity = (cityId) => {
        if (cities.length === 0)
            return '';
        try {
            const city = cities.find(city => city.id === cityId);
            return city ? city.name : '';
        }
        catch (e) {
            return '';
        }
    }

    const getArrivalCity = (cityId) => {
        if (cities.length === 0)
            return '';
        try {
            const city = cities.find(city => city.id === cityId);
            return city ? city.name : '';
        }
        catch (e) {
            return '';
        }
    }

    const getTimeDate = (timedate) => {
        let date = new Date(timedate);
        const year = new Intl.DateTimeFormat('ru', { day: 'numeric', year: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' }).format(date);
        return year;
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

    const handleUpdate = async (orderId, newStatus) => {
        try {
            const result = await updateOrder(orderId, { status: newStatus });
            if (result.error) {
                // setErrorMessage(result.error);
                // setErrorModalVisible(true);
                return;
            }
            getOrders();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    const handleDelete = async (orderId) => {
        try {
            await deleteOrder(orderId);
            getOrders();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    useEffect(() => {
        getOrders();
        getTickets();
    }, []);

    console.log(dispatcherPanel);
    console.log(orders);

    return (
        <Container>
            {orders.length === 0 && !dispatcherPanel ?
                <h2 className='mt-4 text-center'>Вы еще не заказывали билеты. Возвращайтесь, когда закажете :)</h2>
                :
                <Table bordered className='mt-3'>
                    <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Откуда</th>
                            <th>Куда</th>
                            <th>Время отправки</th>
                            <th>Время прибытия</th>
                            <th>Авиакомпания</th>
                            <th>Цена</th>
                            <th>Статус</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dispatcherPanel ?
                                orders.map(order => {
                                    const ticket = tickets.find(ticket => ticket.id == order.ticket_id)
                                    if (ticket)
                                        if (ticket.airline_id == dispatcher.airline_id && order.user_id != dispatcher.user_id)
                                            return <tr key={order.id}>
                                                <td>{getFullName(order.id)}</td>
                                                <td>{getDepartureCity(ticket.departure_city_id)}</td>
                                                <td>{getArrivalCity(ticket.arrival_city_id)}</td>
                                                <td>{getTimeDate(ticket.departure_time)}</td>
                                                <td>{getTimeDate(ticket.arrival_time)}</td>
                                                <td>{getAirline(ticket.airline_id)}</td>
                                                <td>{ticket.price}</td>
                                                <td>{getStatus(order.status)}</td>
                                                <td>
                                                    {order.status == 'pending' ?
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Button onClick={() => { handleUpdate(order.id, 'approved'); }}>
                                                                Одобрить
                                                            </Button>
                                                            <Button
                                                                className='ms-3'
                                                                variant='outline-danger'
                                                                onClick={() => { handleUpdate(order.id, 'denied'); }}>
                                                                Отказать
                                                            </Button>
                                                        </div>
                                                        :
                                                        <>
                                                            {
                                                                (new Date(ticket.departure_time) < new Date() || order.status == 'denied') &&
                                                                <Button variant='outline-danger' onClick={() => { handleDelete(order.id); }}>
                                                                    Удалить
                                                                </Button>
                                                            }
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                }
                                )
                                :
                                orders.map(order => {
                                    const ticket = tickets.find(ticket => ticket.id == order.ticket_id);
                                    if (ticket)
                                        return <tr key={order.id}>
                                            <td>{getFullName(order.id)}</td>
                                            <td>{getDepartureCity(ticket.departure_city_id)}</td>
                                            <td>{getArrivalCity(ticket.arrival_city_id)}</td>
                                            <td>{getTimeDate(ticket.departure_time)}</td>
                                            <td>{getTimeDate(ticket.arrival_time)}</td>
                                            <td>{getAirline(ticket.airline_id)}</td>
                                            <td>{ticket.price}</td>
                                            <td>{getStatus(order.status)}</td>
                                            <td>
                                                <Button variant='outline-danger' onClick={() => { handleDelete(order.id); }}>
                                                    {
                                                        order.status == 'denied' || new Date(ticket.departure_time) < new Date()
                                                            ?
                                                            'Удалить' : 'Отказаться'
                                                    }
                                                </Button>
                                            </td>
                                        </tr>
                                }
                                )
                        }
                    </tbody>
                </Table>
            }
        </Container >

    );
})

export default Orders;
