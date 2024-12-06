import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { format } from 'date-fns';
import { updateTicket } from '../../http/ticketApi';

function UpdateTicket({ show, onHide, cities, ticket }) {
    const [departureCityId, setDepartureCityId] = useState(0)
    const [arrivalCityId, setArrivalCityId] = useState(0)
    const [departureTime, setDepartureTime] = useState(new Date())
    const [arrivalTime, setArrivalTime] = useState(new Date())
    const [price, setPrice] = useState(0)
    const [alert, setAlert] = useState('')

    const handleOnShow = () => {
        if (!Object.keys(ticket).length !== 0) {
            setDepartureCityId(ticket.departure_city_id);
            setArrivalCityId(ticket.arrival_city_id);
            setDepartureTime(new Date(ticket.departure_time));
            setArrivalTime(new Date(ticket.arrival_time));
            setPrice(ticket.price);
        }
    }

    const weekDays = [
        'воскресенье',
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница',
        'суббота',
    ]

    const clearInformation = () => {
        setDepartureCityId(0);
        setArrivalCityId(0);
        setPrice(0);
        setAlert('');
    }

    const update = async () => {
        if (departureCityId === 0 || arrivalCityId === 0) {
            setAlert('Введите город');
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

        if (departureTime >= arrivalTime) {
            setAlert('Время отправления не может быть позже или эквивалентно времени прибытия');
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

        try {
            const new_ticket = {
                departure_city_id: departureCityId,
                arrival_city_id: arrivalCityId,
                departure_time: departureTime.toISOString(),
                arrival_time: arrivalTime.toISOString(),
                price
            };
            const result = await updateTicket(ticket.id, new_ticket);
            if (result.error) {
                setAlert(result.error);
                return;
            }
        }
        catch (e) {
            throw new Error(e.message);
        }

        clearInformation();

        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            onShow={handleOnShow}
            size="lg"
            centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Обновить инфорамцию о билете
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Select value={departureCityId} onChange={e => setDepartureCityId(e.target.value)}>
                        <option value={0}>Откуда</option>
                        {cities.map(city =>
                            <option key={city.id} value={city.id}>{city.name}</option>
                        )
                        }
                    </Form.Select>
                    <Form.Select value={arrivalCityId} className='mt-2' onChange={e => setArrivalCityId(e.target.value)}>
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
                    <Form.Control value={format(departureTime, "yyyy-MM-dd'T'HH:mm")} onChange={e => {
                        const date = new Date(e.target.value);
                        if (!isNaN(date))
                            setDepartureTime(new Date(date))
                    }} type='datetime-local' />
                    <Form.Label className='mt-2'>{isNaN(arrivalTime) ?
                        'Время прибытия' :
                        'Время прибытия. День недели: ' + weekDays[arrivalTime.getDay()]}</Form.Label>
                    <Form.Control value={format(arrivalTime, "yyyy-MM-dd'T'HH:mm")} onChange={e => {
                        const date = new Date(e.target.value);
                        if (!isNaN(date))
                            setArrivalTime(new Date(date))
                    }} type='datetime-local' />
                    <Form.Control className="mt-3" value={price} onChange={e => setPrice(e.target.value)} />
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={e => { onHide(); clearInformation(); }}>Закрыть</Button>
                <Button variant="outline" onClick={update}>Обновить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateTicket;