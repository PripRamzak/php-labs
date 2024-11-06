import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { updateAirline } from '../../http/airlinesApi';

function UpdateAirline({ show, onHide, airline }) {
    const [name, setName] = useState('')
    const [alert, setAlert] = useState('')

    const handleOnShow = () => {
        if (!Object.keys(airline).length !== 0) {
            setName(airline.name);
        }
    }

    const update = async () => {
        try {
            const new_name = name.trim();
            const result = await updateAirline(airline.id, {name: new_name});
            if (result.error) {
                setAlert(result.error);
                return;
            }
        }
        catch (e) {
            throw new Error(e.message);
        }

        setAlert('');

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
                    Обновить инфорамцию о городе
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} placeholder={'Название города'} />
                </Form>
                {alert &&
                    <Alert className='mt-3 p-1 text-center' variant='danger'>{alert}</Alert>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" onClick={onHide}>Закрыть</Button>
                <Button variant="outline" onClick={update}>Обновить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateAirline;
