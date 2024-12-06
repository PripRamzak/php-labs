import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { updateWeights } from '../../http/weightsApi';

function UpdateWeights({ show, onHide, weights }) {
    const [departureCityWeight, setDepartureCityWeight] = useState(0);
    const [arrivalCityWeight, setArrivalCityWeight] = useState(0);
    const [airlineWeight, setAirlineWeight] = useState(0);
    const [alert, setAlert] = useState('');

    const regexWeight = /^[0-1]?(\.[0-9]{0,2})?$/;

    const handleOnShow = () => {
        if (!Object.keys(weights).length !== 0) {
            setDepartureCityWeight(weights.departure_city_weight);
            setArrivalCityWeight(weights.arrival_city_weight);
            setAirlineWeight(weights.airline_weight);
        }
    }

    const handleChangeWeight = (weight, setWeight) => {
        if (regexWeight.test(weight))
            setWeight(weight);
    }

    const clearInformation = () => {
        setAlert('');
    }

    const update = async () => {
        try {
            const newWeights = {
                departure_city_weight: parseFloat(departureCityWeight),
                arrival_city_weight: parseFloat(arrivalCityWeight),
                airline_weight: parseFloat(airlineWeight)
            };
            const result = await updateWeights(newWeights);
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
                    Обновить веса критериев сортировки
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control className="mt-3"
                        value={departureCityWeight}
                        onChange={e => handleChangeWeight(e.target.value, setDepartureCityWeight)} />
                    <Form.Control className="mt-3"
                        value={arrivalCityWeight}
                        onChange={e => handleChangeWeight(e.target.value, setArrivalCityWeight)} />
                    <Form.Control className="mt-3"
                        value={airlineWeight}
                        onChange={e => handleChangeWeight(e.target.value, setAirlineWeight)} />
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={() => { onHide(); clearInformation(); }}>Закрыть</Button>
                <Button variant="outline" onClick={update}>Обновить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateWeights;