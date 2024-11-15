import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { deleteTicket, fetchTickets, fetchTicketsByAirlineId } from '../http/ticketApi';
import CreateTicket from './modals/CreateTicket';
import UpdateTicket from './modals/UpdateTicket';
import { SearchInput } from './SearchInput';
import CreateOrder from './modals/CreateOrder';
import { fetchDispatcherByUserId } from '../http/dispatchersApi';

const Tickets = observer(({ cities, airlines, dispatcher, dispatcherPanel = false }) => {
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

    console.log(airlines);

    const getTickets = async () => {
        try {
            const data = dispatcherPanel && !!dispatcher ? await fetchTicketsByAirlineId(dispatcher.airline_id) : await fetchTickets();
            if (Array.isArray(data)) {
                setTickets(data);
                setFiltredTickets(data);
            } else {
                throw new Error('Полученные данные не являются массивом');
            }
        } catch (err) {
            // setError(err.message || 'Ошибка при загрузке данных. Попробуйте позже.');
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
    }

    useEffect(() => {
        handleSearchChange();
    }, [searchedDepartureCity, searchedArrivalCity, searchedDepartureTime, searchedArrivalTime]);

    const handleDelete = async (TicketId) => {
        try {
            await deleteTicket(TicketId);
            getTickets();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    return (
        <Container>
            {/* <h4 className='mt-2'>Города</h4> */}
            <Row>
                <Col md={3}>
                    <SearchInput
                        onChange={(e) => setSearchedDepartureCity(e.target.value)}
                        placeholder={'Откуда'}
                    />
                </Col>
                <Col md={3}>
                    <SearchInput
                        onChange={(e) => setSearchedArrivalCity(e.target.value)}
                        placeholder={'Куда'}
                    />
                </Col>
                <Col md={3}>
                    <Form.Control
                        className='mt-3'
                        onChange={(e) => { try { setSearchedDepartureTime(new Date(e.target.value)) } catch (e) { setSearchedArrivalTime({}) } }}
                        placeholder={'Время прибытия'}
                        type='date'
                    />
                </Col>
                <Col md={3}>
                    <Form.Control
                        className='mt-3'
                        onChange={(e) => { try { setSearchedArrivalTime(new Date(e.target.value)) } catch (e) { setSearchedArrivalTime({}) } }}
                        placeholder={'Время отправки'}
                        type='date'
                    />
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
                        <th>
                            {dispatcherPanel &&
                                <Button onClick={() => setCreateModalVisible(true)}>
                                    Добавить
                                </Button>
                            }
                        </th>
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
                                    <td>
                                        <Button
                                            className='ms-3'
                                            variant='dark'
                                            onClick={() => { setCreateOrderModalVisible(true); setSelectedTicket(ticket); }}>
                                            Оформить
                                        </Button>
                                    </td>
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
                        airlines={airlines}
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
