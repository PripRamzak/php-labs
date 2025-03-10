import React, { useState } from 'react';
import { Alert, Button, Dropdown, DropdownItem, Form, FormSelect, Modal } from 'react-bootstrap';
import { addTicket } from '../../http/ticketApi';

function CreateTicket({ show, onHide, cities, airlineId }) {
    const [departureCityId, setDepartureCityId] = useState(0)
    const [arrivalCityId, setArrivalCityId] = useState(0)
    const [departureTime, setDepartureTime] = useState({})
    const [arrivalTime, setArrivalTime] = useState({})
    const [price, setPrice] = useState(0)
    const [alert, setAlert] = useState('')

    const weekDays = [
        'воскресенье',
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница',
        'суббота',
    ]

    const createTicket = async () => {

        if (departureCityId == 0) {
            setAlert('Введите город отправления');
            return;
        }

        console.log(departureTime);
        console.log(arrivalTime);

        if (arrivalCityId == 0) {
            setAlert('Введите город прибытия');
            return;
        }

        if (departureCityId == arrivalCityId) {
            setAlert('Нельзя выбрать одинаковые города');
            return;
        }

        if (isNaN(departureTime)) {
            setAlert('Некорректное время отправления');
            return;
        }

        if (isNaN(arrivalTime)) {
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
                departure_time: departureTime.toISOString(),
                arrival_time: arrivalTime.toISOString(),
                price,
                departure_city_id: departureCityId,
                arrival_city_id: arrivalCityId,
                airline_id: airlineId
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
        setDepartureTime({});
        setArrivalTime({});
        setPrice(0);
        setAlert('');

        onHide();
    }

    const clearInformation = () => {
        setDepartureCityId(0);
        setArrivalCityId(0);
        setDepartureTime({});
        setArrivalTime({});
        setPrice(0);
        setAlert('');
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
                    <Form.Label className='mt-2'>{isNaN(departureTime) ?
                        'Время отправления' :
                        'Время отправления. День недели: ' + weekDays[departureTime.getDay()]
                    }
                    </Form.Label>
                    <Form.Control onChange={e => {
                        const date = new Date(e.target.value);
                        setDepartureTime(new Date(date))
                    }} type='datetime-local' />
                    <Form.Label className='mt-2'>{isNaN(arrivalTime) ?
                        'Время отправления' :
                        'Время отправления. День недели: ' + weekDays[arrivalTime.getDay()]}</Form.Label>
                    <Form.Control onChange={e => {
                        const date = new Date(e.target.value);
                        setArrivalTime(new Date(date))
                    }} type='datetime-local' />
                    <Form.Control className="mt-3" value={price} onChange={e => setPrice(e.target.value)} type='number' />
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={e => { onHide(); clearInformation(); }}>Закрыть</Button>
                <Button variant="outline" onClick={createTicket}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateTicket;
