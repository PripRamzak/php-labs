import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { updateCity } from '../../http/cityApi';

function UpdateCity({ show, onHide, city }) {
    const [name, setName] = useState('')
    const [alert, setAlert] = useState('')

    const handleOnShow = () => {
        if (!Object.keys(city).length !== 0) {
            setName(city.name);
        }
    }

    console.log(name);

    const update = async () => {
        try {
            const new_name = name.trim()
            const result = await updateCity(city.id, {name: new_name});
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

    useEffect(() => {
        setAlert('');
    }, [show]);

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

export default UpdateCity;
