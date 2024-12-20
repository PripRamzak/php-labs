import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { addCity } from '../../http/cityApi';

function CreateCity({ show, onHide }) {
    const [name, setName] = useState('')
    const [file, setFile] = useState(null)
    const [alert, setAlert] = useState('')

    const createCity = async () => {
        if (!file) {
            setAlert('Вы не выбрали файл');
            return;
        }

        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('img', file)
            const result = await addCity(formData);
            if (result.error) {
                setAlert(result.error);
                return;
            }
        }
        catch (e) {
            throw new Error(e.message);
        }

        onHide();
    }

    useEffect(() => {
        if (!show)
        {
            setName('');
            setFile(null)
            setAlert('')
        }
    }, [show])

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
                    <Form.Label className='mt-2'>Изображение города</Form.Label>
                    <Form.Control type='file' onChange={(e) => setFile(e.target.files[0])} />
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
