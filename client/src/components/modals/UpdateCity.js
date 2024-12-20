import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Image, Modal } from 'react-bootstrap';
import { updateCity } from '../../http/cityApi';
import { API_URL } from '../../utils/consts';

function UpdateCity({ show, onHide, city }) {
    const [name, setName] = useState('')
    const [img, setImg] = useState('')
    const [file, setFile] = useState(null)
    const [alert, setAlert] = useState('')

    const handleOnShow = () => {
        if (!Object.keys(city).length !== 0) {
            setName(city.name);
            setImg(city.img)
        }
    }

    console.log(name);

    const update = async () => {
        try {
            const formData = new FormData()
            formData.append('updated_id', city.id)
            formData.append('name', name.trim())
            if (file)
                formData.append('img', file)
            const result = await updateCity(formData);
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
                <Form className='d-flex flex-column'>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} placeholder={'Название города'} />
                    <Form.Label className='mt-2'>Изображение города</Form.Label>
                    <Form.Control type='file' onChange={(e) => setFile(e.target.files[0])} />
                    <Form.Label className='mt-2'>Изображение города сейчас</Form.Label>
                    <Image className='mt-1' width={300} height={200} src={API_URL + "../img/cities/" + img} />
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
