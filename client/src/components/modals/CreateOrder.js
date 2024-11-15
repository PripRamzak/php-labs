import React, { useState } from 'react';
import { Alert, Button, Dropdown, DropdownItem, Form, FormSelect, Modal } from 'react-bootstrap';
import { addTicket } from '../../http/ticketApi';
import { addOrder } from '../../http/ordersApi';

function CreateOrder({ show, onHide, ticketId, userId }) {
    const [surname, setSurname] = useState('')
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [alert, setAlert] = useState('')

    const createOrder = async () => {
        try {
            const order = {
                firstname: firstName.trim(),
                surname: surname.trim(),
                middlename: middleName.trim(),
                status: 'pending',
                user_id: userId,
                ticket_id: ticketId
            };
            console.log(order)
            const result = await addOrder(order);
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
                    Оформить билет
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control value={surname} onChange={e => setSurname(e.target.value)} placeholder={'Фамилия'} />
                    <Form.Control className='mt-3' value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={'Имя'} />
                    <Form.Control className='mt-3' value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder={'Отчество'} />
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={onHide}>Закрыть</Button>
                <Button variant="outline" onClick={createOrder}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateOrder;
