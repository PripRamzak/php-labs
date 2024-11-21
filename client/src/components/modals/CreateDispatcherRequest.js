import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { addRequest } from '../../http/dispatcherRequestApi';

function CreateDispatcherRequest({ show, onHide, airlines, userId }) {
    const [surname, setSurname] = useState('')
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [airlineId, setAirlineId] = useState(0)
    const [alert, setAlert] = useState('')

    const createRequest = async () => {
        if (airlineId == 0) {
            setAlert('Выберите авиакомпанию, в которой Вы работаете');
            return;
        }

        try {
            const request = {
                firstname: firstName.trim(),
                surname: surname.trim(),
                middlename: middleName.trim(),
                status: 'pending',
                user_id: userId,
                airline_id: airlineId
            };
            const result = await addRequest(request);
            if (result.error) {
                setAlert(result.error);
                return;
            }
        }
        catch (e) {
            throw new Error(e.message);
        }

        setSurname('');
        setFirstName('');
        setMiddleName('');
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
                    Оформить заявку на диспетчера
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control value={surname} onChange={e => setSurname(e.target.value)} placeholder={'Фамилия'} />
                    <Form.Control className='mt-3' value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={'Имя'} />
                    <Form.Control className='mt-3' value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder={'Отчество'} />
                    <Form.Select className='mt-2' onChange={e => setAirlineId(e.target.value)}>
                        <option value={0}>Авиакомпания</option>
                        {airlines.map(airline =>
                            <option key={airline.id} value={airline.id}>{airline.name}</option>
                        )
                        }
                    </Form.Select>
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={onHide}>Закрыть</Button>
                <Button variant="outline" onClick={createRequest}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateDispatcherRequest;
