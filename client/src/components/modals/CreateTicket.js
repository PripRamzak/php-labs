import React, { useState } from 'react';
import { Alert, Button, Dropdown, DropdownItem, Form, FormSelect, Modal } from 'react-bootstrap';
import { addTicket } from '../../http/ticketApi';

function CreateTicket({ show, onHide, cities, airlines }) {
    const [departureCityId, setDepartureCityId] = useState(0)
    const [arrivalCityId, setArrivalCityId] = useState(0)
    const [airlineId, setAirlineId] = useState(0)
    const [departureTime, setDepartureTime] = useState(new Date())
    const [arrivalTime, setArrivalTime] = useState(new Date())
    const [price, setPrice] = useState(0)
    const [alert, setAlert] = useState('')

    const createTicket = async () => {
        console.log(price);
        console.log(departureCityId)
        console.log(arrivalCityId)

        if (departureCityId == 0) {
            setAlert('Введите город отправления');
            return;
        }

        if (arrivalCityId == 0) {
            setAlert('Введите город прибытия');
            return;
        }

        if (departureCityId == arrivalCityId) {
            setAlert('Нельзя выбрать одинаковые города');
            return;
        }

        if (isNaN(departureTime.getTime())) {
            setAlert('Некорректное время отправления');
            return;
        }

        if (isNaN(arrivalTime.getTime())) {
            setAlert('Некорректное время прибытия');
            return;
        }

        if (departureTime > arrivalTime) {
            setAlert('Время отправления не может быть позже времени прибытия');
            return;
        }

        const now = new Date();
        if (departureTime.getTime() < now.getTime()) {
            setAlert('Некорректное время отправления');
            return;
        }

        if (price <= 0) {
            setAlert('Некорректная стоимость билета');
            return;
        }
        else if (price >= 2147483647) {
            setAlert('Некорректная стоимость билета');
            return;
        }

        try {
            const ticket = {
                departure_city_id: departureCityId,
                arrival_city_id: arrivalCityId,
                airline_id: airlineId,
                departure_time: departureTime.toISOString(),
                arrival_time: arrivalTime.toISOString(),
                price
            };
            const result = await addTicket(ticket);
            if (result.error) {
                setAlert(result.error);
                return;
            }
        }
        catch (e) {
            throw new Error(e.message);
        }

        setDepartureCityId(0);
        setArrivalCityId(0);
        setAirlineId(0);
        setDepartureTime(new Date());
        setArrivalTime(new Date());
        setPrice(0);
        setAlert('');

        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить билет
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Select onChange={e => setDepartureCityId(e.target.value)}>
                        <option value={0}>Откуда</option>
                        {cities.map(city =>
                            <option key={city.id} value={city.id}>{city.name}</option>
                        )
                        }
                    </Form.Select>
                    <Form.Select className='mt-2' onChange={e => setArrivalCityId(e.target.value)}>
                        <option value={0}>Куда</option>
                        {cities.map(city =>
                            <option key={city.id} value={city.id}>{city.name}</option>
                        )
                        }
                    </Form.Select>
                    <Form.Select className='mt-2' onChange={e => setAirlineId(e.target.value)}>
                        <option value={0}>Авиакомпания</option>
                        {airlines.map(airline =>
                            <option key={airline.id} value={airline.id}>{airline.name}</option>
                        )
                        }
                    </Form.Select>
                    <Form.Label className='mt-2'>Время отправления</Form.Label>
                    <Form.Control onChange={e => { try { setDepartureTime(new Date(e.target.value)) } catch (e) { setDepartureTime({}) } }} type='datetime-local' />
                    <Form.Label className='mt-2'>Время прибытия</Form.Label>
                    <Form.Control onChange={e => { try { setArrivalTime(new Date(e.target.value)) } catch (e) { setArrivalTime({}) } }} type='datetime-local' />
                    <Form.Control className="mt-3" value={price} onChange={e => setPrice(e.target.value)} type='number' />
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={onHide}>Закрыть</Button>
                <Button variant="outline" onClick={createTicket}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateTicket;
