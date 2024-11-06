import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { addCity } from '../../http/cityApi';

function CreateCity({ show, onHide }) {
    const [name, setName] = useState('')
    const [alert, setAlert] = useState('')

    const createCity = async () => {
        try {
            const result = await addCity(name.trim());
            if (result.error) {
                setAlert(result.error);
                return;
            }
            setName('');
        }
        catch (e)
        {
            throw new Error(e.message);
        }

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
                    Добавить город
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
                <Button variant="outline" onClick={createCity}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateCity;
