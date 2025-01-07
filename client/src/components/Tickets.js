import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { deleteTicket, fetchPriorityTickets, fetchTickets, fetchTicketsByAirlineId } from '../http/ticketApi';
import CreateTicket from './modals/CreateTicket';
import UpdateTicket from './modals/UpdateTicket';
import { SearchInput } from './SearchInput';
import CreateOrder from './modals/CreateOrder';
import Cookies from 'js-cookie';

const Tickets = observer(({ loading, setLoading, cities, airlines, dispatcher, dispatcherPanel = false }) => {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : 0;

    const [Tickets, setTickets] = useState([]);
    const [filtredTickets, setFiltredTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState({});
    const [searchedDepartureCity, setSearchedDepartureCity] = useState('');
    const [searchedArrivalCity, setSearchedArrivalCity] = useState('');
    const [searchedDepartureTime, setSearchedDepartureTime] = useState(new Date('Invalid'));
    const [searchedArrivalTime, setSearchedArrivalTime] = useState(new Date('Invalid'));
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [createOrderModalVisible, setCreateOrderModalVisible] = useState(false);

    const getTickets = async () => {
        try {
            let data;
            if (dispatcherPanel && !!dispatcher)
                data = await fetchTicketsByAirlineId(dispatcher.airline_id);
            else if (!!user) {
                data = await fetchPriorityTickets(userId);
            }
            else {
                data = await fetchTickets();
            }

            if (Array.isArray(data)) {
                setTickets(data);
                setFiltredTickets(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
        }
        finally {
            if (loading)
                setLoading(false)
        }
    };

    useEffect(() => {
        getTickets();
    }, [cities, airlines, dispatcher]);

    const getDepartureCity = (ticket) => {
        if (cities.length === 0)
            return '';
        try {
            const city = cities.find(city => city.id === ticket.departure_city_id);
            return city ? city.name : '';
        }
        catch (e) {
            return '';
        }
    }

    const getArrivalCity = (ticket) => {
        if (cities.length === 0)
            return '';
        try {
            const city = cities.find(city => city.id === ticket.arrival_city_id);
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

    const getAirline = (ticket) => {
        if (airlines.length === 0)
            return '';
        try {
            const airline = airlines.find(airline => airline.id === ticket.airline_id);
            return airline ? airline.name : '';
        }
        catch (e) {
            return '';
        }
    }

    const handleSearchChange = () => {
        const filtred = Tickets.filter((ticket) => getDepartureCity(ticket).toLowerCase().includes(searchedDepartureCity.toLowerCase().trim()) &&
            getArrivalCity(ticket).toLowerCase().includes(searchedArrivalCity.toLowerCase().trim()) &&
            (isNaN(searchedDepartureTime.getTime()) ||
                (new Date(ticket.departure_time)).toISOString().substring(0, 10) === searchedDepartureTime.toISOString().substring(0, 10)) &&
            (isNaN(searchedArrivalTime.getTime()) ||
                (new Date(ticket.arrival_time)).toISOString().substring(0, 10) === searchedArrivalTime.toISOString().substring(0, 10)));
        setFiltredTickets(filtred);

        if (searchedDepartureCity) 
            updateCookie(searchedDepartureCity, 'recentDepartureCities');

        if (searchedArrivalCity)
            updateCookie(searchedArrivalCity, 'recentArrivalCities');
    }

    const handleDelete = async (TicketId) => {
        try {
            await deleteTicket(TicketId);
            getTickets();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    const updateCookie = (value, cookieName) => {
        let values = Cookies.get(cookieName) ? JSON.parse(Cookies.get(cookieName)) : [];
        values = values.filter(v => v.toLowerCase() !== value.toLowerCase());
        values.unshift(value);

        if (values.length > 5) 
            values.pop();

        Cookies.set(cookieName, JSON.stringify(values), { expires: 7 });
    }

    if (loading)
        return;

    console.log(searchedDepartureCity);

    return (
        <Container>
            <Row className='d-flex align-items-center'>
                <Col md={3}>
                    <SearchInput
                        value={searchedDepartureCity}
                        onChange={(e) => setSearchedDepartureCity(e.target.value)}
                        cookieName={'recentDepartureCities'}
                        placeholder={'Откуда'}
                    />
                </Col>
                <Col md={3}>
                    <SearchInput
                        value={searchedArrivalCity}
                        onChange={(e) => setSearchedArrivalCity(e.target.value)}
                        cookieName={'recentArrivalCities'}
                        placeholder={'Куда'}
                    />
                </Col>
                <Col md={2}>
                    <Form.Control
                        className='mt-3'
                        onChange={(e) => { try { setSearchedDepartureTime(new Date(e.target.value)) } catch (e) { setSearchedArrivalTime({}) } }}
                        placeholder={'Время прибытия'}
                        type='date'
                    />
                </Col>
                <Col md={2}>
                    <Form.Control
                        className='mt-3'
                        onChange={(e) => { try { setSearchedArrivalTime(new Date(e.target.value)) } catch (e) { setSearchedArrivalTime({}) } }}
                        placeholder={'Время отправки'}
                        type='date'
                    />
                </Col>
                <Col className='mt-3' md={2}>
                    <Button style={{ width: '100%' }} variant='outline-dark' onClick={() => handleSearchChange()}>Найти</Button>
                </Col>
            </Row>
            <Table bordered className='mt-2'>
                <thead>
                    <tr>
                        <th>Откуда</th>
                        <th>Куда</th>
                        <th>Время отправки</th>
                        <th>Время прибытия</th>
                        <th>Авиакомпания</th>
                        <th>Цена</th>
                        {!!user &&
                            <th>
                                {dispatcherPanel &&
                                    <Button onClick={() => setCreateModalVisible(true)}>
                                        Добавить
                                    </Button>
                                }
                            </th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        dispatcherPanel ?
                            filtredTickets.map((ticket) =>
                                <tr key={ticket.id}>
                                    <td>{getDepartureCity(ticket)}</td>
                                    <td>{getArrivalCity(ticket)}</td>
                                    <td>{getTimeDate(ticket.departure_time)}</td>
                                    <td>{getTimeDate(ticket.arrival_time)}</td>
                                    <td>{getAirline(ticket)}</td>
                                    <td>{ticket.price}</td>
                                    <td>
                                        <Button onClick={() => { setUpdateModalVisible(true); setSelectedTicket(ticket) }}>
                                            Редактировать
                                        </Button>
                                        <Button className='ms-3' variant='outline-danger' onClick={() => handleDelete(ticket.id)}>
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>)
                            :
                            filtredTickets.filter((ticket) => new Date(ticket.departure_time) > new Date()).map((ticket) =>
                                <tr key={ticket.id}>
                                    <td>{getDepartureCity(ticket)}</td>
                                    <td>{getArrivalCity(ticket)}</td>
                                    <td>{getTimeDate(ticket.departure_time)}</td>
                                    <td>{getTimeDate(ticket.arrival_time)}</td>
                                    <td>{getAirline(ticket)}</td>
                                    <td>{ticket.price}</td>
                                    {!!user &&
                                        <td>
                                            <Button
                                                className='ms-3'
                                                variant='dark'
                                                onClick={() => { setCreateOrderModalVisible(true); setSelectedTicket(ticket); }}>
                                                Оформить
                                            </Button>
                                        </td>
                                    }
                                </tr>
                            )
                    }
                </tbody>
            </Table>
            {dispatcherPanel ?
                <>
                    <CreateTicket
                        show={createModalVisible}
                        onHide={() => { setCreateModalVisible(false); getTickets(); }}
                        cities={cities}
                        airlineId={dispatcher.airline_id}
                    />
                    <UpdateTicket
                        show={updateModalVisible}
                        onHide={() => { setUpdateModalVisible(false); getTickets(); }}
                        cities={cities}
                        airlines={airlines}
                        ticket={selectedTicket}
                    />
                </>
                :
                <CreateOrder show={createOrderModalVisible}
                    onHide={() => { setCreateOrderModalVisible(false); }}
                    ticketId={selectedTicket.id}
                    userId={userId}
                />
            }
        </Container >
    );
})

export default Tickets;
